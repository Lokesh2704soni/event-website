import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "श्री खाटू श्याम मंदिर, अजमेर",
  description: "श्री खाटू श्याम मंदिर, अजमेर",
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