import Footer from "@/components/Footer";
import Header from "@/components/Header";
import InitGuard from "@/guard/InitGuard";
import { Quicksand, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-quicksand",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title: "No Contact",
  description: "Starter Next.js + Tailwind project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[#FFF9FA]" suppressHydrationWarning>
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