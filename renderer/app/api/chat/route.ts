import { OpenAIChat } from "@/ai/openai";
// 删除 StreamingTextResponse 导入
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json()
    const { paperId, _, prompt, prevMessages } = body
    const response = await OpenAIChat(paperId, prompt, prevMessages)

    // 简化响应处理逻辑
    return response;

  } catch (error) {
    console.log("CHAT WITH AI ERROR", error)
    return new NextResponse("Chat with ai error", { status: 500 })
  }
}