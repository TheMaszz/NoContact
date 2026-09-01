// components/Loading.jsx
import React from "react";

const Loading = () => {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFF9FA] overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-20 -left-16 w-72 h-72 bg-[#FFE1E9] rounded-full blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 bg-[#EDE4FF] rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center w-16 h-16">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF6F91] to-[#C9B6FF] opacity-30 animate-ping" />
          <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6F91] to-[#C9B6FF] shadow-[0_8px_24px_-6px_rgba(255,111,145,0.5)] animate-pulse">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6" aria-hidden="true">
              <path d="M12 21s-6.7-4.3-9.3-8.1C1 10.5 1.4 7.4 3.6 5.6c2-1.6 4.7-1.2 6.2.6L12 8.4l2.2-2.2c1.5-1.8 4.2-2.2 6.2-.6 2.2 1.8 2.6 4.9.9 7.3C18.7 16.7 12 21 12 21z" />
            </svg>
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-[#5B4B6A]">กำลังเตรียมพื้นที่ให้คุณ</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F91]" style={{ animation: "bounce-dot 1.2s ease-in-out infinite", animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9B6FF]" style={{ animation: "bounce-dot 1.2s ease-in-out infinite", animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9770]" style={{ animation: "bounce-dot 1.2s ease-in-out infinite", animationDelay: "300ms" }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loading;