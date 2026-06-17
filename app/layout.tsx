import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sharib Ahmed — Full-Stack Developer",
  description:
    "Portfolio of Sharib Ahmed, a full-stack developer and data analytics enthusiast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
