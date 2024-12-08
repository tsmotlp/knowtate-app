import { archivePaper, favoritePaper, getPaperById, removePaper, renamePaper, updateAnnotionOfPaper } from "@/data/paper"
import { NextResponse } from "next/server"
import path from "path"
import fs from 'fs';
import { removeNotesOfPaper } from "@/data/note";
import { removeMessagesOfPaper } from "@/data/message";

export const PATCH = async (
  req: Request,
  { params }: { params: { paperId: string } }
) => {
  try {
    const { paperId } = await params;
    const body = await req.json()
    const { title, archived, favorited, annotations } = body
    if (title) {
      const renamedPaper = await renamePaper(paperId, title)
      if (renamedPaper) {
        return NextResponse.json(renamedPaper)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else if (archived === true) {
      const archivedPaper = await archivePaper(paperId, true)
      if (archivedPaper) {
        return NextResponse.json(archivedPaper)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else if (archived === false) {
      const restoredPaper = await archivePaper(paperId, false)
      if (restoredPaper) {
        return NextResponse.json(restoredPaper)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else if (favorited === true) {
      const favoritedPaper = await favoritePaper(paperId, true)
      if (favoritedPaper) {
        return NextResponse.json(favoritedPaper)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else if (favorited === false) {
      const unfavoritedPaper = await favoritePaper(paperId, false)
      if (unfavoritedPaper) {
        return NextResponse.json(unfavoritedPaper)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else if (annotations === "" || annotations) {
      const updateAnnotations = await updateAnnotionOfPaper(paperId, annotations)
      if (updateAnnotations) {
        return NextResponse.json(updateAnnotations)
      }
      return new NextResponse("Failed to update paper", { status: 500 })
    } else {
      return new NextResponse("Unexpected field", { status: 404 })
    }
  } catch (error) {
    console.log("UPDATE PAPER ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export const DELETE = async (
  request: Request,
  { params }: { params: { paperId: string } }
) => {
  try {
    const { paperId } = await params;
    const removedPaper = await removePaper(paperId)
    if (removedPaper) {
      // 删除对应的notes
      await removeNotesOfPaper(removedPaper.id)
      // 删除对应的messages
      await removeMessagesOfPaper(removedPaper.id)
      // 删除对应的向量数据库文件（TODO）
      // 删除对应的pdf文件
      const filePath = path.join(process.cwd(), "renderer", "public", removedPaper.url)
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath)
          console.log("PDF FILE REMOVED", filePath)
        } catch (error) {
          console.log("REMOVE PAPER PDF FILE ERROR", error)
        }
      }
      return new NextResponse("Paper removed", { status: 200 })
    }
  } catch (error) {
    console.log("DELETE PAPER ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export const GET = async ({
  params
}: {
  params: {
    paperId: string
  }
}) => {
  try {
    const { paperId } = await params;
    const paper = await getPaperById(paperId)
    if (paper) {
      return NextResponse.json(paper)
    }
  } catch (error) {
    console.log("GET PAPER ERROR", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}