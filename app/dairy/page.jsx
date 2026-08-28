"use client";

import { useState } from "react";
import { Sparkles, Heart, PenLine, Check } from "lucide-react";
import { QUICK_MOODS } from "../../constant/constant";

export default function Page() {
  const [mood, setMood] = useState(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!mood) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main
      className="relative flex flex-1 flex-col items-center justify-center p-6 bg-[#FFF9FA] overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ambient blobs */}
      <div className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 bg-[#EDE4FF] rounded-full blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-[#FFE1E9] rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 w-full max-w-md rounded-[2rem] bg-white border border-[#F1E4EA] p-6 shadow-[0_10px_30px_-12px_rgba(255,111,145,0.25)]">
        <Sparkles className="absolute top-6 right-6 w-4 h-4 text-[#F4D8E0]" aria-hidden="true" />

        {/* header */}
        <div className="flex items-center gap-2 mb-5">
          <span className="flex items-center justify-center w-9 h-9 rounded-full  shadow-sm text-base">
            🌱
          </span>
          <p className="text-[#2E1F3A] font-medium text-sm">บันทึกหัวใจประจำวัน</p>
        </div>

        {/* mood question */}
        <p className="text-sm text-[#2E1F3A] font-medium mb-3">
          1. วันนี้รู้สึกยังไงบ้าง?
        </p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {QUICK_MOODS.map(({ id, emoji, label }) => (
            <button
              key={id}
              onClick={() => setMood(id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all duration-200 ${
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

        {/* note */}
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
            placeholder=""
            maxLength={280}
            className="textarea w-full min-h-[100px] rounded-2xl bg-[#FCF8FA] border border-[#F1E4EA] focus:border-[#FF6F91] focus:ring-2 focus:ring-[#FFD9E2] focus:outline-none text-[#2E1F3A] text-sm p-4 resize-none placeholder:text-[#B8ABC4] transition-all duration-200"
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

        <button
          onClick={handleSave}
          disabled={!mood}
          className={`py-3 w-full btn rounded-full border-none text-sm font-medium transition-all duration-200 ${
            saved
              ? "bg-[#5CB870] text-white"
              : mood
              ? "bg-[#2E1F3A] hover:bg-[#42304F] hover:scale-[1.02] active:scale-[0.98] text-white"
              : "bg-[#F1E4EA] text-[#B8ABC4] cursor-not-allowed"
          }`}
        >
          {saved ? (
            <span className="flex items-center justify-center gap-1.5 ">
              <Check className="w-4 h-4" />
              บันทึกแล้ว
            </span>
          ) : (
            "บันทึก"
          )}
        </button>

        {/* reflection */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF0F3] to-[#F3EEFF] px-4 py-4 border border-[#F1E4EA] mt-5">
          <Sparkles className="absolute -bottom-2 -right-2 w-10 h-10 text-white/60" aria-hidden="true" />
          <p className="relative text-xs text-[#FF6F91] font-semibold mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            มุมมองของฉัน
          </p>
          <p className="relative text-sm text-[#2E1F3A] leading-relaxed">
            "ร้านกาแฟเดิมเป็นเรื่องของอดีต แต่การที่คุณก้าวผ่านมันได้
            ในวันนี้ คือความเติบโตของคุณนะ"
          </p>
        </div>

        {/* companion note */}
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-[#F5EDF0]">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#C9B6FF] to-[#FF6F91] shrink-0">
            <Heart className="w-3 h-3 text-white fill-white" />
          </span>
          <p className="text-[11px] text-[#B8ABC4]">ทุกความรู้สึกของคุณมีความหมายนะ</p>
        </div>
      </div>
    </main>
  );
}