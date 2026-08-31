"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Sparkles,
  Heart,
  PenLine,
  Check,
  Loader2,
  Pencil,
  CalendarCheck,
} from "lucide-react";
import { QUICK_MOODS } from "@/constant/constant";
import type {
  MoodId,
  AnalysisRequestBody,
  AiDiaryAnalysisResponse,
  Status,
} from "@/types";
import { useAppStore } from "@/lib/store";

const REFLECTIONS: Record<MoodId, string> = {
  low: "วันที่รู้สึกแย่ ไม่ได้แปลว่าคุณล้มเหลวนะ มันแค่เป็นวันที่ต้องการการโอบกอดตัวเองมากขึ้น",
  missing:
    "การคิดถึงเขาไม่ใช่เรื่องผิด แค่ลองสังเกตดูว่าความคิดถึงนี้พาคุณกลับไปหรือพาคุณเดินต่อ",
  okay: "แค่ผ่านวันนี้ไปได้เฉยๆ ก็ถือว่าเก่งมากแล้วนะ ไม่ต้องรีบให้ตัวเองรู้สึกดีขึ้นเร็วกว่านี้",
  smiling:
    "ดีใจด้วยนะที่วันนี้ใจคุณเบาขึ้น เก็บความรู้สึกนี้ไว้เป็นหลักฐานว่าคุณกำลังไปได้ดี",
};

function parseMoodParam(value: string | null): MoodId | null {
  const validIds: MoodId[] = ["low", "missing", "okay", "smiling"];
  return validIds.includes(value as MoodId) ? (value as MoodId) : null;
}

function moodMeta(id: string | null | undefined) {
  return QUICK_MOODS.find((m) => m.id === id);
}

export default function Page() {
  const searchParams = useSearchParams();
  const entries = useAppStore((s) => s.entries);

  // Recomputed only when entries actually change, not on every render.
  const todayEntry = useMemo(
    () => useAppStore.getState().getTodayEntry(),
    [entries],
  );
  const hasSavedToday = Boolean(todayEntry?.mood);

  // "view" shows today's saved entry read-only; "form" is the editable state.
  const [mode, setMode] = useState<"view" | "form">(
    hasSavedToday ? "view" : "form",
  );

  const [mood, setMood] = useState<MoodId | null>(
    () =>
      (todayEntry?.mood as MoodId | undefined) ??
      parseMoodParam(searchParams.get("mood")),
  );
  const [note, setNote] = useState(todayEntry?.note ?? "");
  const [status, setStatus] = useState<Status>("idle");
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const reflectionText = aiMessage ?? (mood ? REFLECTIONS[mood] : "");
  const alreadySavedToday = status === "done";

  const handleSave = async () => {
    if (!mood || status === "loading") return;

    setStatus("loading");
    setAiMessage(null);

    const userProfile = useAppStore.getState().profile ?? undefined;
    const body: AnalysisRequestBody = { userMessage: note, userProfile, mood };

    useAppStore.getState().updateTodayDiary(mood, note.trim());

    try {
      const res = await fetch("/api/diary-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Analysis failed: ${res.status}`);

      const data = (await res.json()) as AiDiaryAnalysisResponse;
      setAiMessage(data.message);

      useAppStore.getState().updateTodayDiary(mood, note.trim(), data.message);

      setStatus("done");
      setMode("view");
    } catch {
      setStatus("error");
      setMode("view");
    }
  };

  const startEdit = () => {
    setMood((todayEntry?.mood as MoodId | undefined) ?? null);
    setNote(todayEntry?.note ?? "");
    setStatus("idle");
    setAiMessage(null);
    setMode("form");
  };

  // ---------- View mode: today's entry already exists ----------
  if (mode === "view" && todayEntry) {
    const meta = moodMeta(todayEntry.mood);
    const savedReflection = todayEntry.aiReframing ?? reflectionText;

    return (
      <main
        className="relative flex flex-1 flex-col items-center justify-center p-6 bg-[#FFF9FA] overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 bg-[#EDE4FF] rounded-full blur-3xl opacity-60" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-[#FFE1E9] rounded-full blur-3xl opacity-60" />

        <div className="relative z-10 w-full max-w-md rounded-[2rem] bg-white border border-[#F1E4EA] p-6 shadow-[0_10px_30px_-12px_rgba(255,111,145,0.25)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#E8F5EA] border border-[#F1E4EA] text-base">
                <CalendarCheck className="w-4 h-4 text-[#5CB870]" />
              </span>
              <p
                className="text-[#2E1F3A] font-medium text-sm"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                บันทึกของวันนี้
              </p>
            </div>
            <button
              type="button"
              onClick={startEdit}
              className="flex items-center gap-1 text-xs font-medium text-[#8B7E9C] hover:text-[#FF6F91] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6F91] focus-visible:outline-offset-2 rounded-full px-2 py-1"
            >
              <Pencil className="w-3 h-3" />
              แก้ไข
            </button>
          </div>

          {meta && (
            <div className="flex items-center gap-3 mb-5 rounded-2xl bg-[#FCF8FA] border border-[#F1E4EA] px-4 py-3">
              <span className="text-2xl leading-none" aria-hidden="true">
                {meta.emoji}
              </span>
              <div>
                <p className="text-[10px] text-[#8B7E9C] font-medium mb-0.5">
                  อารมณ์วันนี้
                </p>
                <p className="text-sm text-[#2E1F3A] font-medium">
                  {meta.label}
                </p>
              </div>
            </div>
          )}

          {todayEntry.note && (
            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-2">
                <PenLine className="w-3.5 h-3.5 text-[#8B7E9C]" />
                <p className="text-sm text-[#2E1F3A] font-medium">
                  สิ่งที่คุณเขียนไว้
                </p>
              </div>
              <p className="rounded-2xl bg-[#FCF8FA] border border-[#F1E4EA] px-4 py-3 text-sm text-[#2E1F3A] leading-relaxed whitespace-pre-wrap">
                {todayEntry.note}
              </p>
            </div>
          )}

          {savedReflection && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF0F3] to-[#F3EEFF] px-4 py-4 border border-[#F1E4EA]">
              <Sparkles
                className="absolute -bottom-2 -right-2 w-10 h-10 text-white/60"
                aria-hidden="true"
              />
              <p className="relative text-xs text-[#FF6F91] font-semibold mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                มุมมองของฉัน
              </p>
              <p className="relative text-sm text-[#2E1F3A] leading-relaxed">
                {savedReflection}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#F5EDF0]">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#C9B6FF] to-[#FF6F91] shrink-0">
              <Heart className="w-3 h-3 text-white fill-white" />
            </span>
            <p className="text-[11px] text-[#B8ABC4]">
              คุณบันทึกใจของวันนี้แล้ว เก่งมากนะ
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ---------- Form mode: no entry yet today, or editing an existing one ----------
  return (
    <main
      className="relative flex flex-1 flex-col items-center justify-center p-6 bg-[#FFF9FA] overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 bg-[#EDE4FF] rounded-full blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-[#FFE1E9] rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 w-full max-w-md rounded-[2rem] bg-white border border-[#F1E4EA] p-6 shadow-[0_10px_30px_-12px_rgba(255,111,145,0.25)]">
        <Sparkles
          className="absolute top-6 right-6 w-4 h-4 text-[#F4D8E0]"
          aria-hidden="true"
        />

        <div className="flex items-center gap-2 mb-5">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FCF8FA] border border-[#F1E4EA] shadow-sm text-base">
            🌱
          </span>
          <p
            className="text-[#2E1F3A] font-medium text-sm"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            บันทึกหัวใจประจำวัน
          </p>
        </div>

        <p className="text-sm text-[#2E1F3A] font-medium mb-3">
          1. วันนี้รู้สึกยังไงบ้าง?
        </p>
        <div
          className="grid grid-cols-4 gap-2 mb-6"
          role="group"
          aria-label="เลือกอารมณ์วันนี้"
        >
          {QUICK_MOODS.map(({ id, emoji, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMood(id)}
              aria-pressed={mood === id}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6F91] focus-visible:outline-offset-2 ${
                mood === id
                  ? "bg-[#FFF0F3] border-[#FF6F91] scale-[1.03]"
                  : "border-[#F1E4EA] hover:bg-[#FCF8FA]"
              }`}
            >
              <span className="text-xl leading-none" aria-hidden="true">
                {emoji}
              </span>
              <span
                className={`text-[10px] font-medium leading-tight text-center ${
                  mood === id ? "text-[#FF6F91]" : "text-[#8B7E9C]"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mb-2">
          <PenLine className="w-3.5 h-3.5 text-[#8B7E9C]" />
          <p className="text-sm text-[#2E1F3A] font-medium">
            บันทึกสั้นๆ (ถ้ามี)
          </p>
        </div>
        <div className="relative mb-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เล่าให้เราฟังหน่อยว่าวันนี้เป็นยังไงบ้าง..."
            maxLength={280}
            className="w-full min-h-[100px] rounded-2xl bg-[#FCF8FA] border border-[#F1E4EA] focus:border-[#FF6F91] focus:ring-2 focus:ring-[#FFD9E2] focus:outline-none text-[#2E1F3A] text-sm p-4 resize-none placeholder:text-[#B8ABC4] transition-all duration-200"
          />
          <span className="absolute bottom-3 right-4 flex items-center gap-1 text-[10px] font-medium text-[#C9B6D8]">
            <Heart
              className="w-3 h-3 transition-colors duration-200"
              style={{
                fill: note.length > 0 ? "#FF6F91" : "none",
                color: note.length > 0 ? "#FF6F91" : "#D8C9E0",
              }}
            />
            {note.length}/280
          </span>
        </div>

        <div className="flex gap-2">
          {hasSavedToday && (
            <button
              type="button"
              onClick={() => setMode("view")}
              className="py-3 px-5 rounded-full border border-[#F1E4EA] text-sm font-medium text-[#5B4B6A] hover:bg-[#FCF8FA] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#5B4B6A] focus-visible:outline-offset-2"
            >
              ยกเลิก
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!mood || status === "loading" || alreadySavedToday}
            aria-live="polite"
            className={`flex-1 py-3 rounded-full border-none text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              mood && status !== "loading"
                ? "bg-[#2E1F3A] hover:bg-[#42304F] hover:scale-[1.02] active:scale-[0.98] text-white focus-visible:outline-[#2E1F3A]"
                : "bg-[#F1E4EA] text-[#B8ABC4] cursor-not-allowed"
            }`}
          >
            {status === "loading" ? (
              <span className="flex items-center justify-center gap-1.5">
                <Loader2 className="w-4 h-4 animate-spin motion-reduce:animate-none" />
                กำลังบันทึก...
              </span>
            ) : (
              "บันทึก"
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#F5EDF0]">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#C9B6FF] to-[#FF6F91] shrink-0">
            <Heart className="w-3 h-3 text-white fill-white" />
          </span>
          <p className="text-[11px] text-[#B8ABC4]">
            ทุกความรู้สึกของคุณมีความหมายนะ
          </p>
        </div>
      </div>
    </main>
  );
}
