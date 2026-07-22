import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AppStoreProvider } from "@/store/AppStore";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import ShiprocketLoader from "@/components/ShiprocketLoader";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-nunito",
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
    <html lang="en" className={nunito.variable} suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <AppStoreProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-cream shadow-xl">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <CartDrawer />
        </AppStoreProvider>

        <ShiprocketLoader />
      </body>
    </html>
  );
}
