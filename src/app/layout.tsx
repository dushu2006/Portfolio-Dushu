import type { Metadata } from "next";
import "@fontsource-variable/roboto-flex/full.css";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/newsreader";
import "@fontsource-variable/newsreader/standard-italic.css";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/syne";
import "@fontsource/instrument-serif";
import "@fontsource/instrument-serif/400-italic.css";
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
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
