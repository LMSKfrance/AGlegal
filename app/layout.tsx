import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Cormorant_Garamond, Noto_Sans_Georgian } from "next/font/google";
import "../styles/index.css";
import cn from "classnames";
import { LanguageProvider } from "@/contexts/LanguageContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const notoSansGeorgian = Noto_Sans_Georgian({
  variable: "--font-noto-sans-georgian",
  subsets: ["georgian", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AG Legal",
  description: "The UI Template for AG Legal",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.variable,
          plusJakartaSans.variable,
          cormorantGaramond.variable,
          notoSansGeorgian.variable,
        )}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
