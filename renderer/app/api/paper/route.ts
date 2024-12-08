import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs';
import { createPaper } from "@/data/paper";
import { createNote } from "@/data/note";
import PDFParser from "pdf2json";

interface PDFMetadata {
  [key: string]: any;  // 允许任意字符串键
}

interface PDFData {
  Meta: PDFMetadata;
}

const parsePdfDate = (dateStr: string): Date | null => {
  // 正则表达式来提取日期部分
  const match = /D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/.exec(dateStr);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 月份从 0 开始计数
    const day = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const second = parseInt(match[6], 10);

    // 创建一个 UTC 日期对象
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }
  return null; // 如果不匹配，返回 null
}

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData()
    const paper = formData.get("paper") as File;
    const title = formData.get("title") as string;
    const categoryId = formData.get("categoryId") as string;

    if (!paper) {
      return new NextResponse("No paper uploaded", { status: 404 });
    }

    if (!title) {
      return new NextResponse("Title is not specified", { status: 404 });
    }

    // 处理文件的保存
    const url = `/papers/${Date.now().toString()}.pdf`;
    const data = await paper.arrayBuffer();
    const buffer = Buffer.from(data);

    const pdfData = await new Promise<PDFData>((resolve, reject) => {
      const pdfParser = new PDFParser()
      pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => {
        reject(errData.parserError)
      })
      pdfParser.on("pdfParser_dataReady", (pdfData: PDFData) => {  // 移除 async
        resolve(pdfData)
      })
      pdfParser.parseBuffer(buffer)
    })
    const paperTitle = (pdfData.Meta.Title as string) || title
    const authors = pdfData.Meta.Author as string
    const publication = pdfData.Meta.Subject as string
    const publicateDate = pdfData.Meta.publicateDate as string
    const parsedDate = publicateDate ? parsePdfDate(publicateDate)?.toDateString() : undefined
    await fs.writeFile(`renderer/public${url}`, buffer);
    const paperInfo = await createPaper(paperTitle, url, categoryId, authors, publication, parsedDate)
    if (paperInfo) {
      await createNote(`《${paperInfo.title}》的笔记`, "Markdown", "notes", paperInfo.id)
      await createNote(`《${paperInfo.title}》的白板`, "Whiteboard", "whiteboards", paperInfo.id)
      return NextResponse.json(paperInfo);
    }
    return new NextResponse("Internal server error", { status: 500 });
  } catch (error) {
    console.log("UPLOAD PAPER ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}