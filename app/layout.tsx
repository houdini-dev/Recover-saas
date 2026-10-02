import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recover — Customer Recovery",
  description: "Recover leads, reservations and repeat customers before they disappear."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
