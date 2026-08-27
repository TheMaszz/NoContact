"use client";

import { useState } from "react";
import { Heart, Sparkles, Settings, Palette, Menu, X, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const showBack = Boolean(pathname && pathname !== "/");

  const navLink =
    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-[#5B4B6A] hover:text-[#2E1F3A] hover:bg-[#FFF0F3] transition-colors duration-200";

  return (
    <header className="sticky top-4 z-50 px-4">
      <div
        className="mx-auto max-w-4xl flex items-center justify-between
                   bg-white/90 backdrop-blur-md border border-[#F1E4EA]
                   rounded-full shadow-[0_4px_20px_-4px_rgba(255,111,145,0.25)]
                   px-3 py-2"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Back button (visible when not on /) */}
        {showBack && (
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center justify-center w-9 h-9 rounded-full text-[#5B4B6A] hover:bg-[#FFF0F3] transition-colors duration-200 mr-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Logo */}
        <a href="/" className="flex items-center gap-2 pl-2 pr-3 group">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-full
                       bg-gradient-to-br from-[#FF6F91] to-[#C9B6FF]
                       shadow-sm group-hover:scale-105 transition-transform duration-200"
          >
            <Heart className="w-4 h-4 text-white fill-white" />
          </span>
          <span
            className="text-lg font-semibold text-[#2E1F3A] tracking-tight"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            No Contact
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FCF8FA] rounded-full p-1">
          <a href="/" className={navLink}>
            <Sparkles className="w-4 h-4" />
            MoveOn Spaces
          </a>
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-1">
          <a
            href="/settings"
            aria-label="Settings"
            className="flex items-center justify-center w-9 h-9 rounded-full
                       text-[#5B4B6A] hover:text-[#2E1F3A] hover:bg-[#FFF0F3]
                       transition-colors duration-200"
          >
            <Settings className="w-4 h-4" />
          </a>
          <a
            href="/theme"
            aria-label="Theme"
            className="flex items-center justify-center w-9 h-9 rounded-full
                       text-[#5B4B6A] hover:text-[#2E1F3A] hover:bg-[#FFF0F3]
                       transition-colors duration-200"
          >
            <Palette className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full
                     text-[#2E1F3A] hover:bg-[#FFF0F3] transition-colors duration-200"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="mx-auto max-w-4xl mt-2 bg-white/95 backdrop-blur-md
                     border border-[#F1E4EA] rounded-3xl shadow-lg p-2 flex flex-col gap-1 md:hidden"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          <a href="/" className={navLink}>
            <Sparkles className="w-4 h-4" />
            MoveOn Spaces
          </a>
          <a href="/settings" className={navLink}>
            <Settings className="w-4 h-4" />
            Settings
          </a>
          <a href="/theme" className={navLink}>
            <Palette className="w-4 h-4" />
            Theme
          </a>
        </div>
      )}
    </header>
  );
}
