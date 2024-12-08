import OpenAI from "openai";
import { ChatMessageProps } from "@/app/papers/[paperId]/_components/chat/chat-message";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.nextapi.fun/v1"
});

export async function OpenAIChat(paperId: string, prompt: string, prevMessages: ChatMessageProps[] | undefined) {
  try {
    const formattedPrevMessages = prevMessages ? prevMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })) : [];

    const response = await openai.chat.completions.create(
      {
        model: "gpt-3.5-turbo",
        temperature: 0,
        stream: true,
        messages: [
          {
            role: "system",
            content: "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
          },
          {
            role: "user",
            content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
                
          \n----------------\n
          
          PREVIOUS CONVERSATION:
          ${formattedPrevMessages.map((message) => {
              if (message.role === "user") return `User: ${message.content}\n`;
              return `Assistant: ${message.content}\n`;
            })}
          
          \n----------------\n
          
          USER INPUT: ${prompt}`,
          },
        ],
      }
    );

    // 简化流处理逻辑
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    // 返回标准的流式响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.log("[OPENAI_CHAT_COMPLETION_ERROR]", error);
    throw error;
  }
}