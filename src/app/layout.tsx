import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dusyanth — Developer, AI Explorer & Builder",
  description:
    "Portfolio of Dusyanth — AI & Data Science student at VIIT. Building autonomous systems, multi-agent workflows, and production-grade developer tooling.",
  keywords: [
    "Dusyanth",
    "portfolio",
    "AI",
    "developer",
    "full-stack",
    "machine learning",
    "VIIT",
  ],
  authors: [{ name: "Dusyanth" }],
  openGraph: {
    title: "Dusyanth — Developer, AI Explorer & Builder",
    description:
      "AI & Data Science student exploring autonomous systems, multi-agent workflows, and scalable backend architectures.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
