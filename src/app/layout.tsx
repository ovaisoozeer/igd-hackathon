import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harbor — Candidates and providers",
  description:
    "A Next.js template with server-side rendering, authentication, and a candidate or provider signup flow.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
