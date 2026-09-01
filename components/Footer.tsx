import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#FFF9FA] border-t border-[#F1E4EA]">
      <div
        className="max-w-4xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 text-sm text-[#5B4B6A]">
          <span
            className="flex items-center justify-center w-6 h-6 rounded-full
                       bg-gradient-to-br from-[#FF6F91] to-[#C9B6FF]"
          >
            <Heart className="w-3 h-3 text-white fill-white" />
          </span>
          <span
            style={{ fontFamily: "'Quicksand', sans-serif" }}
            className="font-medium text-[#2E1F3A]"
          >
            No Contact
          </span>
          <span className="text-[#B8ABC4]">·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <a
            href="/privacy"
            className="px-3 py-1.5 rounded-full text-[#5B4B6A] hover:text-[#2E1F3A] hover:bg-[#FFF0F3] transition-colors duration-200"
          >
            Privacy
          </a>
          <a
            href="/support"
            className="px-3 py-1.5 rounded-full text-[#5B4B6A] hover:text-[#2E1F3A] hover:bg-[#FFF0F3] transition-colors duration-200"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
