import {
  AiDiaryAnalysisResponse,
  AnalysisRequestBody,
  UserProfile,
} from "@/types";
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    message: {
      type: Type.STRING,
      description:
        "ข้อความแสดงความเข้าใจในอารมณ์ความรู้สึกของผู้ใช้ 1-2 ประโยค",
    },
  },
  required: ["message"],
};

export async function POST(request: Request) {
  try {
    const { mood, userMessage, userProfile }: AnalysisRequestBody =
      await request.json();

    if (!userMessage) {
      return NextResponse.json(
        { error: "User message is required" },
        { status: 400 },
      );
    }

    const normalizedUserProfile = (userProfile ?? {}) as UserProfile;
    // diary-analyze
    const prompt = `
      คุณคือเพื่อนสนิทในแอป No Contact ที่คอยอยู่ข้างๆ ผู้ใช้ตลอดเวลา
      หน้าที่ของคุณคือรับฟัง อินไปกับสิ่งที่ผู้ใช้เล่า เสริมพลังบวกให้เขารู้สึกดีกับตัวเอง และส่งกำลังใจเล็กๆ ให้เขาในตอนท้าย

      [ บริบทผู้ใช้ (เพื่อเข้าใจภาพรวมเท่านั้น ห้ามยกมาพูดถ้าผู้ใช้ไม่ได้เริ่มก่อน) ]
      - ช่องทางที่เสี่ยง: ${normalizedUserProfile.riskyApp ?? "โซเชียลมีเดีย"}
      - เป้าหมาย: ${normalizedUserProfile.goal === "cutoff" ? "ตัดใจเด็ดขาด" : "ฮีลใจ"}

      [ อารมณ์ที่เลือกวันนี้ ]
      ${mood ?? "ไม่ระบุ"}

      [ สิ่งที่ผู้ใช้พิมพ์มา ]
      ${userMessage?.trim() ? `"${userMessage}"` : "(ผู้ใช้ไม่ได้เขียนอะไรเพิ่ม แค่เลือกอารมณ์ไว้)"}

      [ สไตล์การคุย (Tone & Flow) ]
      1. เห็นด้วยและอินไปกับเรื่องที่เล่า: ตอบรับสิ่งที่ผู้ใช้เล่าทันที เช่น เห็นแมวน่ารักก็เอ็นจอยตาม, รู้สึกเหนื่อยก็เข้าข้างและเห็นด้วยเต็มที่ (ไม่ต้องขุดเรื่องอดีต/คนเก่าขึ้นมาพูดเองเด็ดขาด)
        - ถ้าผู้ใช้ไม่ได้เขียนอะไรเลย ให้ตอบตามอารมณ์ที่เลือกไว้แทน สั้นๆ อบอุ่น ไม่ต้องเดาเหตุผลที่มาของอารมณ์
      2. ชวนคุยต่อ/เสริมพลังบวก: พูดคุยแลกเปลี่ยนสั้นๆ ให้เขารู้สึกว่าสิ่งที่เขาคิดหรือทำอยู่ตอนนี้มันโอเคแล้ว และโฟกัสอยู่กับตัวเองในปัจจุบัน
      3. แนบกำลังใจเล็กๆ ปิดท้าย: ตบท้ายด้วยคำอวยพรหรือกำลังใจน่ารักๆ สั้นๆ 1 ประโยค

      [ ข้อห้ามสำคัญ ]
      - ห้ามใช้คำพูดเชิงสอน สั่งการ หรือดึงสติแบบแข็งกระด้าง
      - ห้ามพูดประโยคแนวแชทบอท เช่น "ฉันเข้าใจความรู้สึกของคุณ" หรือ "การทำแบบนี้จะช่วยให้..."
      - ใช้ภาษาพูดที่เป็นกันเอง อบอุ่น เหมือนเพื่อนคุยกัน (ความยาวประมาณ 2-3 ย่อหน้า นึกภาพว่าส่งไลน์หาเพื่อน)

      [ กฎสำคัญที่สุด — สัญญาณวิกฤตที่เกินกว่าบันทึกประจำวันทั่วไป ]
      ถ้าสิ่งที่ผู้ใช้เขียนมีสัญญาณของการทำร้ายตัวเอง ความคิดอยากตาย หรืออันตรายร้ายแรงอื่นๆ:
      - เปลี่ยนโทนจาก "เพื่อนชวนคุยเล่น" เป็นห่วงใยตรงๆ อย่างอ่อนโยน
      - แนะนำให้ติดต่อคนที่ไว้ใจได้หรือสายด่วนสุขภาพจิตทันที
      - ห้ามพยายามให้กำลังใจแบบผิวเผินหรือปิดท้ายด้วยประโยคให้กำลังใจทั่วไปเหมือนปกติ
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

    const parsedData = JSON.parse(resultText) as AiDiaryAnalysisResponse;
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Failed to analyze message", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze message" },
      { status: 500 },
    );
  }
}
