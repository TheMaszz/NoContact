"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { GOALS, STEP_META, STEP_QUESTIONS } from "../../constant/questions";

function toLocalInputValue(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [goal, setGoal] = useState(null);
  const [startAt, setStartAt] = useState(toLocalInputValue(new Date()));

  const setAnswer = (key, value) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const isStepComplete = (s) => {
    if (s === 4) return Boolean(goal && startAt);
    return STEP_QUESTIONS[s].every((q) => answers[q.key]);
  };

  const handleNext = () => {
    if (!isStepComplete(step)) return;
    if (step < 4) {
      setStep(step + 1);
    } else {
      const payload = {
        ...answers,
        goal,
        startAt,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("user_profile", JSON.stringify(payload));
      router.push("/");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <main
      className="relative flex flex-1  flex-col items-center justify-center p-6 bg-[#FFF9FA] overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 bg-[#EDE4FF] rounded-full blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-[#FFE1E9] rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {STEP_META.map((meta, i) => {
            const n = i + 1;
            const Icon = meta.icon;
            const active = n === step;
            const done = n < step;
            return (
              <div
                key={n}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div
                  className={`w-full h-1.5 rounded-full transition-colors duration-300 ${
                    done || active ? "bg-[#FF6F91]" : "bg-[#F1E4EA]"
                  }`}
                />
                <div
                  className={`hidden sm:flex items-center gap-1 text-[10px] font-medium transition-colors duration-300 ${
                    active
                      ? "text-[#FF6F91]"
                      : done
                        ? "text-[#8B7E9C]"
                        : "text-[#D8C9D2]"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {meta.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Question card */}
        <div className="rounded-[2rem] bg-white border border-[#F1E4EA] p-6 shadow-[0_10px_30px_-12px_rgba(255,111,145,0.2)] mb-4">
          <div className="flex items-center gap-2 mb-5">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6F91] to-[#C9B6FF] shadow-sm">
              {(() => {
                const Icon = STEP_META[step - 1].icon;
                return <Icon className="w-4 h-4 text-white" />;
              })()}
            </span>
            <div>
              <p className="text-[10px] text-[#B8ABC4] font-medium uppercase tracking-wide">
                ขั้นตอนที่ {step} จาก 4
              </p>
              <p className="text-[#2E1F3A] font-medium text-sm">
                {STEP_META[step - 1].label}
              </p>
            </div>
          </div>

          {/* Steps 1-3: generic question list */}
          {step !== 4 &&
            STEP_QUESTIONS[step].map((q) => (
              <div key={q.key} className="mb-5 last:mb-0">
                <p className="text-sm text-[#2E1F3A] font-medium mb-2.5">
                  {q.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => {
                    const selected = answers[q.key] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setAnswer(q.key, opt)}
                        className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                          selected
                            ? "bg-[#FFF0F3] border-[#FF6F91] text-[#FF6F91] scale-[1.02]"
                            : "border-[#F1E4EA] text-[#5B4B6A] hover:bg-[#FCF8FA]"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Step 4: goal + datetime */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-[#2E1F3A] font-medium mb-2.5">
                  เป้าหมายหลักของคุณ
                </p>
                <div className="space-y-2">
                  {GOALS.map((g) => {
                    const selected = goal === g.id;
                    return (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-2xl border transition-all duration-200 ${
                          selected
                            ? "bg-[#FFF0F3] border-[#FF6F91]"
                            : "border-[#F1E4EA] hover:bg-[#FCF8FA]"
                        }`}
                      >
                        <span className="text-xl shrink-0" aria-hidden="true">
                          {g.emoji}
                        </span>
                        <span>
                          <span
                            className={`block text-sm font-medium ${
                              selected ? "text-[#FF6F91]" : "text-[#2E1F3A]"
                            }`}
                          >
                            {g.title}
                          </span>
                          <span className="block text-xs text-[#8B7E9C]">
                            {g.desc}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm text-[#2E1F3A] font-medium mb-2.5">
                  วันและเวลาเริ่มนับ No Contact
                </p>
                <input
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="input w-full rounded-2xl bg-[#FCF8FA] border border-[#F1E4EA] focus:border-[#FF6F91] focus:ring-2 focus:ring-[#FFD9E2] focus:outline-none text-[#2E1F3A] text-sm px-4 py-3"
                />
              </div>
            </div>
          )}
        </div>

        {/* Controller bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              step === 1
                ? "border-[#F1E4EA] text-[#D8C9D2] cursor-not-allowed"
                : "border-[#F1E4EA] text-[#5B4B6A] hover:bg-white"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            ย้อนกลับ
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepComplete(step)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium border-none transition-all duration-200 ${
              isStepComplete(step)
                ? "bg-[#2E1F3A] hover:bg-[#42304F] hover:scale-[1.01] active:scale-[0.98] text-white"
                : "bg-[#F1E4EA] text-[#B8ABC4] cursor-not-allowed"
            }`}
          >
            {step === 4 ? (
              <>
                <Rocket className="w-4 h-4" />
                เริ่มต้นนับ No Contact วันแรก
              </>
            ) : (
              <>
                ถัดไป
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
