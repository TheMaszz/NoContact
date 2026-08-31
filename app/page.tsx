"use client";

import { Heart, HeartHandshake, Sparkles, Check, Wind, Target } from "lucide-react";
import Link from "next/link";
import { QUICK_MOODS } from "@/constant/constant";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const { checkInToday, getTodayEntry, calculateStreak } = useAppStore();

  const streak = calculateStreak();
  const todayEntry = getTodayEntry();
  const isCheckedIn = !!todayEntry?.checkedIn;

  const nextMilestone = streak === 0 ? 7 : Math.ceil((streak + 1) / 7) * 7;
  const progress = Math.min(streak / nextMilestone, 1);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <main
      className="flex flex-1 flex-col items-center justify-center p-6 bg-[#FFF9FA] min-h-screen"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 w-full max-w-4xl md:h-[500px]">
        {/* Streak Hero — the one bold element on the page */}
        <div className="relative row-span-2 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#FF6F91] to-[#C9B6FF] p-8 flex flex-col justify-between text-white shadow-[0_12px_36px_-10px_rgba(255,111,145,0.55)]">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-white/15 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-white/80 text-sm font-medium mb-4">
              <Heart className="w-4 h-4 fill-white/80" />
              คุณไม่ได้ติดต่อมาแล้ว
            </div>

            {/* Progress ring around the streak number */}
            <div className="relative w-40 h-40 mx-auto md:mx-0">
              <svg
                viewBox="0 0 128 128"
                className="w-full h-full -rotate-90 motion-reduce:transition-none"
              >
                <circle
                  cx="64" cy="64" r={radius}
                  fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="8"
                />
                <circle
                  cx="64" cy="64" r={radius}
                  fill="none" stroke="white" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p
                  className="text-5xl font-semibold leading-none"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  {streak}
                </p>
                <p className="text-white/75 text-xs mt-1">วัน · {streak * 24} ชม.</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3">
              <p className="text-sm leading-relaxed">
                เก่งมาก! คุณกำลังดึงชีวิตของตัวเองกลับมาได้ทีละนิดนะ
              </p>
            </div>

            <button
              onClick={checkInToday}
              disabled={isCheckedIn}
              className={`flex items-center gap-1.5 text-sm font-medium w-fit px-4 py-2 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${
                isCheckedIn
                  ? "bg-white/20 text-white cursor-default"
                  : "bg-white text-[#FF6F91] hover:scale-105 active:scale-95 shadow-md"
              }`}
            >
              {isCheckedIn ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  วันนี้เช็กอินแล้ว เก่งมาก!
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  วันนี้ฉันยังไม่ได้ทัก!
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mood check-in */}
        <div className="rounded-[2rem] bg-white border border-[#F1E4EA] p-6 flex flex-col">
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
            {QUICK_MOODS.map(({ id, emoji, label }) => (
              <Link
                key={label}
                href={`/diary?mood=${encodeURIComponent(id)}`}
                aria-label={`บันทึกอารมณ์: ${label}`}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border border-[#F1E4EA] hover:border-[#FF6F91] hover:bg-[#FFF0F3] active:scale-95 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6F91] focus-visible:outline-offset-2"
              >
                <span className="text-xl leading-none" aria-hidden="true">
                  {emoji}
                </span>
                <span className="text-[10px] font-medium text-[#8B7E9C] text-center leading-tight">
                  {label}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-end">
            <Link
              href="/diary"
              className="py-3 rounded-full bg-[#2E1F3A] hover:bg-[#42304F] text-white text-xs font-medium px-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2E1F3A] focus-visible:outline-offset-2"
            >
              บันทึกอารมณ์วันนี้
            </Link>
          </div>
        </div>

        {/* Next milestone — replaces the static quote */}
        <div className="rounded-[2rem] bg-[#FCF8FA] border border-[#F1E4EA] p-6 flex flex-col justify-center gap-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#C9B6FF]" />
            <p className="text-sm font-medium text-[#2E1F3A]">
              เป้าหมายถัดไป: {nextMilestone} วัน
            </p>
          </div>
          <div className="h-2 rounded-full bg-[#F1E4EA] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#FF6F91] to-[#C9B6FF] transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="text-xs text-[#8B7E9C] flex items-center gap-1.5">
            <Wind className="w-3.5 h-3.5" />
            อีก {nextMilestone - streak} วัน ก็ถึงเป้าหมายถัดไปแล้ว
          </p>
        </div>
      </div>

      {/* SOS bar — an invitation, not an alarm */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between gap-3 bg-white border border-[#F1E4EA] rounded-full shadow-[0_6px_20px_-6px_rgba(46,31,58,0.15)] pl-5 pr-2 py-2">
          <p className="text-sm text-[#5B4B6A] font-medium">
            รู้สึกอยากทักไหม? คุยกับเราก่อนได้นะ
          </p>
          <Link
            href="/sos"
            aria-label="ไปที่หน้าขอความช่วยเหลือ SOS"
            className="flex items-center gap-1.5 py-2 rounded-full bg-gradient-to-br from-[#FF6F91] to-[#FF9770] text-white px-4 shrink-0 shadow-md active:scale-95 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6F91] focus-visible:outline-offset-2"
          >
            <HeartHandshake className="w-4 h-4" />
            <span className="text-sm font-bold">SOS</span>
          </Link>
        </div>
      </div>

      <div className="h-20" />
    </main>
  );
}