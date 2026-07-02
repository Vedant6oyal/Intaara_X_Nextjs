import type { Metadata, Viewport } from "next";
import { Cinzel } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppStoreProvider } from "@/store/AppStore";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { SHIPROCKET_SELLER_DOMAIN } from "@/lib/shiprocket";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Intaara · Gift & Redeem",
  description:
    "Pick free anti-tarnish jewellery gifts worth up to ₹1000, then redeem them with your purchase.",
  icons: {
    icon: "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/Intaara_Favicon.avif",
    apple: "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/Intaara_Favicon.avif",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1A3C2A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cinzel.variable} suppressHydrationWarning>
      <head>
        {/* Shiprocket (Fastrr) checkout styles */}
        <link
          rel="stylesheet"
          href="https://fastrr-boost-ui.pickrr.com/assets/styles/shopify.css"
        />
      </head>
      <body suppressHydrationWarning>
        {/* Seller domain Shiprocket has the configuration saved under */}
        <input type="hidden" id="sellerDomain" value={SHIPROCKET_SELLER_DOMAIN} readOnly />

        <AppStoreProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-cream shadow-xl">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <CartDrawer />
        </AppStoreProvider>

        {/* Shiprocket (Fastrr) checkout initiation script */}
        <Script
          src="https://fastrr-boost-ui.pickrr.com/assets/js/channels/shopify.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
