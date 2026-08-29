import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Abhay.dev — Portfolio OS & Developer Workspace",
  description: "A modern developer portfolio and private personal operating system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${inter.variable} dark`}>
      <head>
        {/* Custom Scrollbar & Selection Styling */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Custom Smooth Scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #060911;
          }
          ::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 9999px;
            border: 2px solid #060911;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #06b6d4;
          }

          /* Selection Highlight */
          ::selection {
            background-color: rgba(6, 182, 212, 0.3);
            color: #22d3ee;
          }
        `}} />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}