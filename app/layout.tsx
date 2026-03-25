import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, Cormorant_Garamond, Noto_Sans_Georgian } from "next/font/google";
import "../styles/index.css";
import cn from "classnames";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { getSiteOnlineStatus, getOfflinePageContent, getNavVisibility } from "@/lib/actions/settings";
import { NavVisibilityProvider } from "@/contexts/NavVisibilityContext";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Determine the current pathname (injected by middleware via x-pathname header)
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "/";
  const isAdminRoute = pathname.startsWith("/admin");
  const isApiRoute = pathname.startsWith("/api");

  const hiddenNavIds = isAdminRoute || isApiRoute ? [] : await getNavVisibility();

  // Show offline maintenance page to unauthenticated visitors when site is offline.
  // Admin routes are excluded — admins always access the panel normally.
  if (!isAdminRoute && !isApiRoute) {
    const online = await getSiteOnlineStatus();
    if (!online) {
      const session = await auth();
      if (!session) {
        const { title, message } = await getOfflinePageContent();
        return (
          <html lang="en">
            <body
              style={{
                margin: 0,
                padding: 0,
                background: "#0055b8",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              <div style={{ textAlign: "center", color: "#ffffff" }}>
                <img
                  src="/logo-white.svg"
                  alt="AG Legal"
                  style={{ width: 140, height: "auto", display: "block", margin: "0 auto 32px" }}
                />
                <h1 style={{ fontSize: 28, fontWeight: 700, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
                  {title}
                </h1>
                <p style={{ fontSize: 16, opacity: 0.8, margin: 0 }}>
                  {message}
                </p>
              </div>
            </body>
          </html>
        );
      }
    }
  }

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
        <LanguageProvider>
          <NavVisibilityProvider hiddenNavIds={hiddenNavIds}>
            {children}
          </NavVisibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
