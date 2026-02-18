import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";
import "./elite-wealth-typography.css";
import "./elite-wealth-design-system.css";
import "./elite-wealth-navigation.css";
import "./elite-wealth-inputs.css";
import "./elite-wealth-graphs.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EW Communications Hub",
  description: "Elite Wealth Communications Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} antialiased`} style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
