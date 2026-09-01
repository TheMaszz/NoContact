"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { GOALS, STEP_META, STEP_QUESTIONS } from "@/constant/questions";
import { useAppStore } from "@/lib/store";
import { UserProfile } from "@/types";


function toLocalInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function Page() {
  const router = useRouter();
  const setProfile = useAppStore((state) => state.setProfile); 

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({}); 
  const [goal, setGoal] = useState<string | null>(null);
  const [startAt, setStartAt] = useState<string>(toLocalInputValue(new Date()));

  const setAnswer = (key: string, value: string) =>
    setAnswers((previous) => ({ ...previous, [key]: value }));

  const isStepComplete = (currentStep: number) => {
    if (currentStep === 4) return Boolean(goal && startAt);
    return STEP_QUESTIONS[currentStep].every((question) => answers[question.key]);
  };

  const handleNext = () => {
    if (!isStepComplete(step)) return;
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    const payload: UserProfile = {
      ...answers,
      goal,
      startAt,
      savedAt: new Date().toISOString(),
    } as unknown as UserProfile; 

    setProfile(payload);
    router.push("/");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <main
      className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#FFF9FA] p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#EDE4FF] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#FFE1E9] opacity-60 blur-3xl" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-8 flex items-center gap-2">
          {STEP_META.map((meta, index) => {
            const n = index + 1;
            const Icon = meta.icon;
            const active = n === step;
            const done = n < step;

            return (
              <div key={n} className="flex flex-1 flex-col items-center gap-1.5">
                <div className={`h-1.5 w-full rounded-full transition-colors duration-300 ${done || active ? "bg-[#FF6F91]" : "bg-[#F1E4EA]"}`} />
                <div className={`hidden items-center gap-1 text-[10px] font-medium transition-colors duration-300 sm:flex ${active ? "text-[#FF6F91]" : done ? "text-[#8B7E9C]" : "text-[#D8C9D2]"}`}>
                  <Icon className="h-3 w-3" />
                  {meta.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-4 rounded-[2rem] border border-[#F1E4EA] bg-white p-6 shadow-[0_10px_30px_-12px_rgba(255,111,145,0.2)]">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6F91] to-[#C9B6FF] shadow-sm">
              {(() => {
                const Icon = STEP_META[step - 1].icon;
                return <Icon className="h-4 w-4 text-white" />;
              })()}
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-[#B8ABC4]">ขั้นตอนที่ {step} จาก 4</p>
              <p className="text-sm font-medium text-[#2E1F3A]">{STEP_META[step - 1].label}</p>
            </div>
          </div>

          {step !== 4 && STEP_QUESTIONS[step].map((question) => (
            <div key={question.key} className="mb-5 last:mb-0">
              <p className="mb-2.5 text-sm font-medium text-[#2E1F3A]">{question.label}</p>
              <div className="flex flex-wrap gap-2">
                {question.options.map((option) => {
                  const selected = answers[question.key] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAnswer(question.key, option)}
                      className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                        selected ? "scale-[1.02] border-[#FF6F91] bg-[#FFF0F3] text-[#FF6F91]" : "border-[#F1E4EA] text-[#5B4B6A] hover:bg-[#FCF8FA]"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <p className="mb-2.5 text-sm font-medium text-[#2E1F3A]">เป้าหมายหลักของคุณ</p>
                <div className="space-y-2">
                  {GOALS.map((entry) => {
                    const selected = goal === entry.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setGoal(entry.id)}
                        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${selected ? "border-[#FF6F91] bg-[#FFF0F3]" : "border-[#F1E4EA] hover:bg-[#FCF8FA]"}`}
                      >
                        <span className="shrink-0 text-xl" aria-hidden="true">{entry.emoji}</span>
                        <span>
                          <span className={`block text-sm font-medium ${selected ? "text-[#FF6F91]" : "text-[#2E1F3A]"}`}>
                            {entry.title}
                          </span>
                          <span className="block text-xs text-[#8B7E9C]">{entry.desc}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2.5 text-sm font-medium text-[#2E1F3A]">วันและเวลาเริ่มนับ No Contact</p>
                <input
                  type="datetime-local"
                  value={startAt}
                  onChange={(event) => setStartAt(event.target.value)}
                  className="input w-full rounded-2xl border border-[#F1E4EA] bg-[#FCF8FA] px-4 py-3 text-sm text-[#2E1F3A] focus:border-[#FF6F91] focus:outline-none focus:ring-2 focus:ring-[#FFD9E2]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${step === 1 ? "cursor-not-allowed border-[#F1E4EA] text-[#D8C9D2]" : "border-[#F1E4EA] text-[#5B4B6A] hover:bg-white"}`}
          >
            <ChevronLeft className="h-4 w-4" />
            กลับ
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isStepComplete(step)}
            className={`ml-auto flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 ${isStepComplete(step) ? "bg-[#2E1F3A] hover:bg-[#42304F]" : "cursor-not-allowed bg-[#F1E4EA] text-[#B8ABC4]"}`}
          >
            {step === 4 ? "เริ่มใช้งาน" : "ถัดไป"}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[#8B7E9C]">
          <Rocket className="h-4 w-4 text-[#FF6F91]" />
          <p className="text-[11px]">เราจะช่วยคุณค่อยๆ เดินออกจากความลึกนี้ไปด้วยกัน</p>
        </div>
      </div>
    </main>
  );
}