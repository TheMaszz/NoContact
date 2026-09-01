"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  HeartCrack,
  Sparkles,
  Radar,
  Send,
  Heart,
  Loader2,
} from "lucide-react";
import type {
  RiskLevel,
  AnalysisRequestBody,
  AiAnalysisResponse,
  Status,
} from "@/types";
import { HEAL_MESSAGES } from "@/constant/constant";
import { useAppStore } from "@/lib/store";

const RISK_STYLES: Record<
  RiskLevel,
  { bg: string; text: string; dot: string; label: string }
> = {
  high: {
    bg: "bg-[#FFE4E9]",
    text: "text-[#E0405F]",
    dot: "bg-[#E0405F]",
    label: "สูง",
  },
  medium: {
    bg: "bg-[#FFF1D9]",
    text: "text-[#C88A1F]",
    dot: "bg-[#E0A83B]",
    label: "ปานกลาง",
  },
  low: {
    bg: "bg-[#E8F5EA]",
    text: "text-[#3F9155]",
    dot: "bg-[#5CB870]",
    label: "ต่ำ",
  },
};



export default function Page() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<AiAnalysisResponse | null>(null);
  const [healMessageIndex, setHealMessageIndex] = useState(0);

  const handleSend = async () => {
    if (!text.trim() || status === "loading") return;
    setStatus("loading");

    const userProfile = useAppStore.getState().profile ?? undefined;

    const body: AnalysisRequestBody = { userMessage: text, userProfile };

    try {
      const res = await fetch("/api/sos-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Analysis failed: ${res.status}`);
      const data = (await res.json()) as AiAnalysisResponse;
      setResult(data);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const riskStyle = result ? RISK_STYLES[result.riskLevel] : null;

  useEffect(() => {
    if (status !== "loading") {
      setHealMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setHealMessageIndex((prev) => (prev + 1) % HEAL_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <main
      className="relative flex flex-1 flex-col items-center justify-center p-6 bg-[#FFF9FA]"
    >
      <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 bg-[#FFE1E9] rounded-full blur-3xl opacity-60" />
      <div className="pointer-events-none absolute bottom-0 -right-20 w-72 h-72 bg-[#EDE4FF] rounded-full blur-3xl opacity-60" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-24 h-24 bg-[#FFF0D9] rounded-full blur-2xl opacity-50" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Input section */}
        <div className="relative rounded-[2rem] bg-white border border-[#F1E4EA] p-6 flex flex-col shadow-[0_10px_30px_-12px_rgba(255,111,145,0.25)]">
          <Sparkles
            className="absolute top-5 right-6 w-4 h-4 text-[#F4D8E0]"
            aria-hidden="true"
          />

          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6F91] to-[#C9B6FF] shadow-sm">
              <HeartCrack className="w-4 h-4 text-white" />
            </span>
            <label
              htmlFor="sos-text"
              className="text-[#2E1F3A] font-medium text-sm leading-snug"
            >
              พิมพ์สิ่งที่อยากพิมพ์กับเราก่อน ก่อนที่คุณจะส่งหาเค้า
            </label>
          </div>

          <div className="relative flex-1">
            <textarea
              id="sos-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="พิมพ์ที่นี่ได้เลยนะ ไม่มีใครเห็นนอกจากคุณ..."
              maxLength={500}
              className="min-h-[180px] w-full h-full rounded-2xl bg-[#FCF8FA] border border-[#F1E4EA] focus:border-[#FF6F91] focus:ring-2 focus:ring-[#FFD9E2] focus:outline-none text-[#2E1F3A] text-sm p-4 resize-none placeholder:text-[#B8ABC4] transition-all duration-200"
            />
            <span className="absolute bottom-3 right-4 flex items-center gap-1 text-[10px] font-medium text-[#C9B6D8]">
              <Heart
                className="w-3 h-3 transition-colors duration-200"
                style={{
                  fill: text.length > 0 ? "#FF6F91" : "none",
                  color: text.length > 0 ? "#FF6F91" : "#D8C9E0",
                }}
              />
              {text.length}/500
            </span>
          </div>

          <button
            onClick={handleSend}
            disabled={!text.trim() || status === "loading"}
            className={`mt-3 self-end flex items-center gap-1.5 rounded-full border-none text-sm font-medium px-5 py-2 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              !text.trim() || status === "loading"
                ? "bg-[#F1E4EA] text-[#B8ABC4] cursor-not-allowed"
                : "bg-[#2E1F3A] hover:bg-[#42304F] hover:scale-[1.03] active:scale-[0.97] text-white focus-visible:outline-[#2E1F3A]"
            }`}
          >
            {status === "loading" ? (
              <>
                กำลังวิเคราะห์
                <Loader2 className="w-3.5 h-3.5 animate-spin motion-reduce:animate-none" />
              </>
            ) : (
              <>
                ส่ง
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Summary section */}
        <div className="relative rounded-[2rem] bg-white border border-[#F1E4EA] p-6 flex flex-col gap-4 shadow-[0_10px_30px_-12px_rgba(201,182,255,0.3)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FCF8FA] border border-[#F1E4EA]">
                <Radar className="w-4 h-4 text-[#8B7E9C]" />
              </span>
              <p className="text-[#2E1F3A] font-medium text-sm">บทวิเคราะห์</p>
            </div>
            {riskStyle && (
              <span
                aria-live="polite"
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${riskStyle.bg} ${riskStyle.text}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${riskStyle.dot} animate-pulse motion-reduce:animate-none`}
                />
                ความเสี่ยง: {riskStyle.label}
              </span>
            )}
          </div>

          {status === "idle" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10 gap-2">
              <Radar className="w-8 h-8 text-[#E8DCE4]" aria-hidden="true" />
              <p className="text-sm text-[#B8ABC4]">
                พิมพ์สิ่งที่อยากส่งหาเขาทางซ้าย แล้วกด "ส่ง"
                เพื่อให้เราช่วยดูด้วยกันนะ
              </p>
            </div>
          )}

          {status === "loading" && (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10">
              <Loader2
                className="w-6 h-6 text-[#C9B6FF] animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              <p
                key={healMessageIndex}
                aria-live="polite"
                className="text-xs text-[#B8ABC4] animate-in fade-in duration-300"
              >
                {HEAL_MESSAGES[healMessageIndex]}
              </p>
            </div>
          )}

          {status === "error" && (
            <div
              role="alert"
              className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10 gap-2"
            >
              <AlertTriangle
                className="w-6 h-6 text-[#E0A83B]"
                aria-hidden="true"
              />
              <p className="text-sm text-[#2E1F3A]">
                วิเคราะห์ไม่สำเร็จ ลองอีกครั้งนะ
              </p>
              <button
                onClick={handleSend}
                className="text-xs font-medium text-[#FF6F91] underline underline-offset-2"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {status === "done" && result && (
            <div className="space-y-3" aria-live="polite">
              <div className="rounded-2xl bg-[#FCF8FA] px-4 py-3 hover:bg-[#FBF2F5] transition-colors duration-200">
                <p className="text-xs text-[#8B7E9C] font-medium mb-1 flex items-center gap-1.5">
                  <span aria-hidden="true">💭</span>
                  สิ่งที่คุณรู้สึก
                </p>
                <p className="text-sm text-[#2E1F3A]">
                  {result.empathyMessage}
                </p>
              </div>

              <div className="rounded-2xl bg-[#FCF8FA] px-4 py-3 hover:bg-[#FBF2F5] transition-colors duration-200">
                <p className="text-xs text-[#8B7E9C] font-medium mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  ผลลัพธ์ที่อาจเกิดขึ้น
                </p>
                <p className="text-sm text-[#2E1F3A]">{result.realityCheck}</p>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FFF0F3] to-[#F3EEFF] px-4 py-3 border border-[#F1E4EA]">
                <Sparkles
                  className="absolute -bottom-2 -right-2 w-10 h-10 text-white/60"
                  aria-hidden="true"
                />
                <p className="relative text-xs text-[#FF6F91] font-semibold mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  ข้อคิด
                </p>
                <p className="relative text-sm text-[#2E1F3A] font-medium">
                  {result.suggestedAction}
                </p>
              </div>
            </div>
          )}

          <div className="mt-auto flex items-center gap-2 pt-2 border-t border-[#F5EDF0]">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#C9B6FF] to-[#FF6F91] shrink-0">
              <Heart className="w-3 h-3 text-white fill-white" />
            </span>
            <p className="text-[11px] text-[#B8ABC4]">
              เราอยู่ตรงนี้กับคุณเสมอนะ
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
