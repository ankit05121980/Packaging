import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PackCraft - Custom Packaging Solutions",
  description:
    "Design and order custom packaging for your brand. Eco-friendly mailer boxes, shipping boxes, rigid boxes, and paper bags with instant pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TooltipProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </TooltipProvider>
      </body>
    </html>
  );
}
