import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InitGuard from "@/guard/InitGuard";
import { Plus_Jakarta_Sans, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai"],
  variable: "--font-noto-sans-thai",
});

export const metadata = {
  title: "No Contact",
  description: "แอปช่วยคุณตัดขาด ฮีลใจ และดึงสติ ไม่ให้กลับไปทักแฟนเก่า",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${notoSansThai.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#FFF9FA]"
        style={{ fontFamily: "var(--font-plus-jakarta)" }}
        suppressHydrationWarning
      >
        <InitGuard>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
          </div>
        </InitGuard>
      </body>
    </html>
  );
}