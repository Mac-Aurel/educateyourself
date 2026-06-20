import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { GoogleTranslate } from "@/components/translate/GoogleTranslate";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "RAISE UR VOICE",
  description:
    "Global conflicts and human rights crises. Read, discuss, act.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full bg-white text-black antialiased">
        <div className="flex justify-end px-5 py-2 sm:px-10">
          <GoogleTranslate />
        </div>
        {children}
      </body>
    </html>
  );
}
