import { Calendar, Flag, Heart, Share2, type LucideIcon } from "lucide-react";
import type { GoalOption, QuestionItem } from "@/types";

export const STEP_META: Array<{ label: string; icon: LucideIcon }> = [
  { label: "บริบทความสัมพันธ์", icon: Heart },
  { label: "ระยะเวลาและความเสี่ยง", icon: Calendar },
  { label: "โซเชียลมีเดีย", icon: Share2 },
  { label: "เป้าหมาย", icon: Flag },
];

export const STEP_QUESTIONS: Record<number, QuestionItem[]> = {
  1: [
    {
      key: "status",
      label: "สถานะความสัมพันธ์",
      options: ["คนคุย", "แฟน", "แต่งงาน", "แฟนเก่าที่วนลูป"],
    },
    {
      key: "duration",
      label: "ระยะเวลาที่คบกัน",
      options: ["< 6 เดือน", "6 เดือน - 2 ปี", "2 - 5 ปี", "> 5 ปี"],
    },
    {
      key: "initiator",
      label: "ใครเป็นคนบอกเลิก",
      options: ["เขาเป็นคนบอกเลิก", "เราเป็นคนบอกเลิก", "จบกันด้วยดี", "โดน Ghost"],
    },
  ],
  2: [
    {
      key: "timeSince",
      label: "เลิก / ขาดการติดต่อกันมานานแค่ไหนแล้ว",
      options: ["เพิ่งเลิกวันนี้ / ไม่กี่วัน", "1 - 4 สัปดาห์", "1 - 6 เดือน", "มากกว่า 6 เดือน"],
    },
    {
      key: "encounterRisk",
      label: "ความเสี่ยงที่จะเจอหน้ากันโดยบังเอิญ",
      options: ["ไม่เจอเลย", "ทำงาน/เรียนที่เดียวกัน", "บ้านใกล้กัน", "กลุ่มเพื่อนเดียวกัน"],
    },
    {
      key: "riskyApp",
      label: "แอพ/ช่องทางที่เผลอกดทักบ่อยที่สุด",
      options: ["LINE", "Instagram", "Facebook", "เบอร์โทรศัพท์"],
    },
  ],
  3: [
    {
      key: "socialStatus",
      label: "สถานะโซเชียลในปัจจุบัน",
      options: ["บล็อกหมดแล้ว", "อันฟอลแล้ว", "ยังฟอลกันอยู่", "แอบส่องเรื่อยๆ"],
    },
    {
      key: "trigger",
      label: "สิ่งที่ทำให้ดิ่งที่สุดในตอนนี้",
      options: ["เห็นรูปเก่า", "ความเงียบ/เหงา", "กลัวเขามีคนใหม่", "รู้สึกไม่ดีพอ"],
    },
  ],
};

export const GOALS: GoalOption[] = [
  { id: "cutoff", emoji: "🛑", title: "Cut-off เด็ดขาด", desc: "ตัดใจ 100% ไม่เอาอีกแล้ว" },
  { id: "heal", emoji: "🩹", title: "ฮีลใจดึงสติ", desc: "ไม่อยากดิ่งและเผลอทักไป" },
  { id: "selflove", emoji: "🕊️", title: "Self-Love", desc: "เรียนรู้ที่จะมีความสุขด้วยตัวเอง" },
];
