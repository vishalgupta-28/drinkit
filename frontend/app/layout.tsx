import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "DrinkIt — Alcohol delivered in minutes",
  description: "Hyperlocal alcohol delivery. Order beer, whisky, wine & more.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0C831F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>

        {/* UserAccess accessibility widget (third-party) */}
        <Script
          src="https://widget-v1.useraccess.live/"
          strategy="afterInteractive"
          data-asw-lang="en"
          data-asw-position="bottom-right"
          data-asw-icon-type="m-full"
        />
      </body>
    </html>
  );
}
