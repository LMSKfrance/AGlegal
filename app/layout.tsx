import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Cormorant_Garamond } from "next/font/google";
import "../styles/index.css";
import cn from "classnames";

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

export const metadata: Metadata = {
  title: "AG Legal",
  description: "The UI Template for AG Legal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.variable,
          plusJakartaSans.variable,
          cormorantGaramond.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
