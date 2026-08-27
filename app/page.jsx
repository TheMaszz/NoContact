"use client";

import { Heart, HeartHandshake, Sparkles } from "lucide-react";
import {  QUICK_MOODS } from "../constant/constant";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-6 bg-[#FFF9FA]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 w-full max-w-4xl md:h-[500px]">
        {/* Streak Main Hero */}
        <div className="relative row-span-2 rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#FF6F91] to-[#C9B6FF] p-8 flex flex-col justify-between text-white shadow-[0_8px_30px_-8px_rgba(255,111,145,0.5)]">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-white/80 text-sm font-medium mb-1">
              <Heart className="w-4 h-4 fill-white/80" />
              คุณไม่ได้ติดต่อมาแล้ว
            </div>
            <p
              className="text-6xl font-semibold leading-none mb-1"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              12 <span className="text-2xl font-medium">วัน</span>
            </p>
            <p className="text-white/70 text-sm">( 288 ชั่วโมง )</p>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3">
              <p className="text-sm leading-relaxed">
                เก่งมาก! คุณกำลังดึงชีวิตของตัวเองกลับมาได้ทีละนิดนะ
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-sm font-medium bg-white text-[#FF6F91] w-fit px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              วันนี้ฉันยังไม่ได้ทัก!
            </button>
          </div>
        </div>

        {/* Quick Actions — mood check-in */}
        <div className="rounded-[2rem] bg-white border border-[#F1E4EA] p-6 flex flex-col shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FCF8FA] border border-[#F1E4EA] text-sm">
              💭
            </span>
            <p className="text-[#2E1F3A] font-medium text-sm">
              วันนี้รู้สึกยังไงบ้าง
            </p>
          </div>
          <p className="text-xs text-[#B8ABC4] mb-4 pl-10">
            แตะเพื่อบันทึกอารมณ์ตอนนี้เลยนะ
          </p>

          <div className="grid grid-cols-4 gap-2 mb-5">
            {QUICK_MOODS.map(({ emoji, label }) => (
              <a
                key={label}
                href="/dairy"
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border border-[#F1E4EA] hover:border-[#FF6F91] hover:bg-[#FFF0F3] hover:scale-[1.03] transition-all duration-200"
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  {emoji}
                </span>
                <span className="text-[10px] font-medium text-[#8B7E9C] text-center leading-tight">
                  {label}
                </span>
              </a>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between">
            <p className="text-[11px] text-[#B8ABC4]">บันทึกล่าสุด: เมื่อวาน</p>
            <a
              href="/dairy"
              className="py-3 btn btn-sm rounded-full bg-[#2E1F3A] hover:bg-[#42304F] border-none text-white text-xs font-medium px-4"
            >
              บันทึกอารมณ์วันนี้
            </a>
          </div>
        </div>

        {/* Gentle Encouragement */}
        <div className="relative rounded-[2rem] bg-[#FCF8FA] border border-[#F1E4EA] p-6 flex items-center overflow-hidden">
          <svg
            className="absolute bottom-0 left-0 w-full opacity-40"
            viewBox="0 0 400 60"
            preserveAspectRatio="none"
          >
            <path
              d="M0,30 C100,60 300,0 400,30 L400,60 L0,60 Z"
              fill="#C9B6FF"
              opacity="0.3"
            />
          </svg>
          <p className="relative z-10 text-[#5B4B6A] text-sm leading-relaxed">
            "ความเศร้าเป็นแค่คลื่น เดี๋ยวมันก็ซาลงไป 🌊"
          </p>
        </div>
      </div>

      {/* SOS Sticky Bottom Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50">
        <div className="flex items-center justify-between gap-3 bg-white border border-[#F1E4EA] rounded-full shadow-[0_8px_24px_-6px_rgba(255,111,145,0.35)] pl-5 pr-2 py-2">
          <p className="text-sm text-[#5B4B6A] font-medium">
            อยากทักเขาหรอ? คุยกับเราก่อนทักไหม?
          </p>
          <a
            href="/sos"
            className="flex items-center gap-1.5 btn btn-sm rounded-full bg-gradient-to-br from-[#FF6F91] to-[#FF9770] border-none text-white px-4 shrink-0"
          >
            <HeartHandshake className="w-4 h-4" />
            SOS
          </a>
        </div>
      </div>

      <div className="h-20" />
    </main>
  );
}
