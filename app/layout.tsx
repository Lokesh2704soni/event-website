import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "श्री लखदातार नवयुवक मंडल, अजमेर",
  description: "श्री लखदातार नवयुवक मंडल, अजमेर",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}