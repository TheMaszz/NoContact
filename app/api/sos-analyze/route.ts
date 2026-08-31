import { GoogleGenAI, Schema, Type } from "@google/genai";
import { NextResponse } from "next/server";
import type { AiAnalysisResponse, AnalysisRequestBody, UserProfile } from "@/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    empathyMessage: {
      type: Type.STRING,
      description: "ข้อความแสดงความเข้าใจในอารมณ์ความรู้สึกของผู้ใช้ 1-2 ประโยค",
    },
    realityCheck: {
      type: Type.STRING,
      description: "การเตือนสติด้วยความจริงอย่างอ่อนโยนและคมคาย อิงจากบริบทของผู้ใช้",
    },
    suggestedAction: {
      type: Type.STRING,
      description: "สิ่งที่ควรลุกไปทำแทนทันทีใน 5 นาทีนี้",
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["high", "medium", "low"],
      description: "ระดับความเสี่ยงในการหลุดทักไปหาแฟนเก่า",
    },
  },
  required: ["empathyMessage", "realityCheck", "suggestedAction", "riskLevel"],
};

export async function POST(request: Request) {
  try {
    const { userMessage, userProfile }: AnalysisRequestBody = await request.json();

    if (!userMessage) {
      return NextResponse.json({ error: "User message is required" }, { status: 400 });
    }

    const normalizedUserProfile = (userProfile ?? {}) as UserProfile;
    const prompt = `
      คุณคือระบบ AI ดึงสติและฮีลใจสำหรับแอป No Contact
      หน้าที่ของคุณคือชะลออารมณ์ชั่ววูบของผู้ใช้ และให้สติด้วยความจริงอย่างอ่อนโยนแต่เด็ดขาด

      [ บริบทส่วนตัวของผู้ใช้ ]
      - สถานะความสัมพันธ์เดิม: ${normalizedUserProfile.status ?? "ไม่ระบุ"} (ระยะเวลา: ${normalizedUserProfile.duration ?? "ไม่ระบุ"})
      - ฝ่ายที่จบความสัมพันธ์: ${normalizedUserProfile.initiator ?? "ไม่ระบุ"}
      - ระยะเวลาที่เลิกกันมา: ${normalizedUserProfile.timeSince ?? "ไม่ระบุ"}
      - ช่องทางที่เสี่ยงทักที่สุด: ${normalizedUserProfile.riskyApp ?? "โซเชียลมีเดีย"}
      - สถานะโซเชียล: ${normalizedUserProfile.socialStatus ?? "ไม่ระบุ"}
      - สิ่งกระตุ้นใจ: ${normalizedUserProfile.trigger ?? "ความเหงา"}
      - เป้าหมายหลักของผู้ใช้: ${normalizedUserProfile.goal === "cutoff" ? "ตัดใจเด็ดขาด ไม่เอาอีกแล้ว" : "ฮีลใจและดึงสติ"}

      [ ข้อความที่ผู้ใช้กำลังจะส่งหาแฟนเก่า / ระบายออกมารอบนี้ ]
      "${userMessage}"
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.7,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No content returned from Gemini API");
    }

    const parsedData = JSON.parse(resultText) as AiAnalysisResponse;
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to analyze message", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Failed to analyze message" }, { status: 500 });
  }
}
