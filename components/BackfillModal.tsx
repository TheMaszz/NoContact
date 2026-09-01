"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, X, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { BackfillAnswer } from "@/types";

const DAY_CAP = 14;

function formatThaiDate(dateString: string) {
  const [y, m, d] = dateString.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("th-TH", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export default function BackfillModal() {

  const entries = useAppStore((s) => s.entries);
  const backfillDates = useAppStore((s) => s.backfillDates);

  const missedDates = useMemo(() => {
    return useAppStore.getState().getMissedDates();
  }, [entries]);

  const [dismissed, setDismissed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, BackfillAnswer>>({});

  useEffect(() => {
    setDismissed(false);
    setAnswers({});
  }, [missedDates.length]);

  if (dismissed || missedDates.length === 0) return null;

  const isBroad = missedDates.length > DAY_CAP;
  const allAnswered = isBroad
    ? Object.keys(answers).length > 0
    : missedDates.every((d) => answers[d]);

  const setAnswer = (date: string, value: BackfillAnswer) =>
    setAnswers((prev) => ({ ...prev, [date]: value }));

  const setBroadAnswer = (value: BackfillAnswer) => {
    const filled: Record<string, BackfillAnswer> = {};
    missedDates.forEach((d) => (filled[d] = value));
    setAnswers(filled);
  };

  const handleSubmit = () => {
    backfillDates(answers);
    setDismissed(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="backfill-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#2E1F3A]/40 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md rounded-[2rem] bg-white border border-[#F1E4EA] p-6 shadow-[0_20px_50px_-15px_rgba(46,31,58,0.35)] max-h-[85vh] flex flex-col">
        <button
          onClick={() => setDismissed(true)}
          aria-label="ข้ามไปก่อน"
          className="absolute top-5 right-5 text-[#B8ABC4] hover:text-[#8B7E9C] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8B7E9C] focus-visible:outline-offset-2 rounded-full p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2 pr-8">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6F91] to-[#C9B6FF] shrink-0">
            <Heart className="w-4 h-4 text-white fill-white" />
          </span>
          <p id="backfill-title" className="text-[#2E1F3A] font-medium text-sm" style={{ fontFamily: "'Quicksand', sans-serif" }}>
            หายไป {missedDates.length} วันเลยนะ
          </p>
        </div>
        <p className="text-xs text-[#8B7E9C] mb-5">
          ไม่เป็นไรนะ แค่อยากรู้ว่าช่วงที่หายไปเป็นยังไงบ้าง จะได้นับวันให้ถูกต้อง
        </p>

        {isBroad ? (
          <div className="space-y-2 mb-5">
            <button
              type="button"
              onClick={() => setBroadAnswer("no_contact")}
              className={`w-full text-left rounded-2xl border px-4 py-3 transition-all duration-200 ${
                answers[missedDates[0]] === "no_contact"
                  ? "border-[#5CB870] bg-[#E8F5EA]"
                  : "border-[#F1E4EA] hover:bg-[#FCF8FA]"
              }`}
            >
              <span className="block text-sm font-medium text-[#2E1F3A]">ไม่ได้ทักไปเลย</span>
              <span className="block text-xs text-[#8B7E9C]">ช่วงที่หายไปทั้งหมดคุณไม่ได้ติดต่อเขา</span>
            </button>
            <button
              type="button"
              onClick={() => setBroadAnswer("contacted")}
              className={`w-full text-left rounded-2xl border px-4 py-3 transition-all duration-200 ${
                answers[missedDates[0]] === "contacted"
                  ? "border-[#E0405F] bg-[#FFE4E9]"
                  : "border-[#F1E4EA] hover:bg-[#FCF8FA]"
              }`}
            >
              <span className="block text-sm font-medium text-[#2E1F3A]">มีทักไปบ้าง</span>
              <span className="block text-xs text-[#8B7E9C]">ไม่เป็นไรนะ วันนี้เริ่มใหม่ได้เสมอ</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2 mb-5 overflow-y-auto pr-1 -mr-1">
            {missedDates.map((date) => (
              <div key={date} className="flex items-center justify-between gap-2 rounded-2xl border border-[#F1E4EA] px-3 py-2.5">
                <span className="text-xs font-medium text-[#5B4B6A] shrink-0">{formatThaiDate(date)}</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAnswer(date, "no_contact")}
                    aria-pressed={answers[date] === "no_contact"}
                    className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full border transition-all duration-200 ${
                      answers[date] === "no_contact"
                        ? "border-[#5CB870] bg-[#E8F5EA] text-[#3F9155]"
                        : "border-[#F1E4EA] text-[#8B7E9C] hover:bg-[#FCF8FA]"
                    }`}
                  >
                    ไม่ได้ทัก
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswer(date, "contacted")}
                    aria-pressed={answers[date] === "contacted"}
                    className={`text-[11px] font-medium px-2.5 py-1.5 rounded-full border transition-all duration-200 ${
                      answers[date] === "contacted"
                        ? "border-[#E0405F] bg-[#FFE4E9] text-[#E0405F]"
                        : "border-[#F1E4EA] text-[#8B7E9C] hover:bg-[#FCF8FA]"
                    }`}
                  >
                    ทักไปแล้ว
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mt-auto pt-2">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-xs font-medium text-[#B8ABC4] hover:text-[#8B7E9C] transition-colors px-2 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#8B7E9C] focus-visible:outline-offset-2 rounded-full"
          >
            ข้ามไปก่อน
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`ml-auto flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              allAnswered
                ? "bg-[#2E1F3A] hover:bg-[#42304F] focus-visible:outline-[#2E1F3A]"
                : "bg-[#F1E4EA] text-[#B8ABC4] cursor-not-allowed"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            บันทึกทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}