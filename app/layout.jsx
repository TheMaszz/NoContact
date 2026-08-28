import Footer from "../components/Footer";
import Header from "../components/Header";
import InitGuard from "../guard/InitGuard";
import "./globals.css";

export const metadata = {
  title: "No Contact",
  description: "Starter Next.js + Tailwind project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FFF9FA]">
        <InitGuard>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </div>
        </InitGuard>
      </body>
    </html>
  );
}
