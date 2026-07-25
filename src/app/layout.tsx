import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AppStoreProvider } from "@/store/AppStore";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import Footer from "@/components/Footer";
import ShiprocketLoader from "@/components/ShiprocketLoader";
import { getAllShopProducts, getShopCollections } from "@/lib/products";
import type { Category } from "@/data/products";

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
    icon: [
      { url: "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/favicon.ico", sizes: "any" },
      { url: "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/favicon-android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/favicon-android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "https://sarvfyflentltumwxzet.supabase.co/storage/v1/object/public/Intaara/favicon-apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1A3C2A",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: Category[] = [];
  try {
    const products = await getAllShopProducts();
    categories = await getShopCollections(products);
  } catch (err) {
    console.error("Failed to load footer collections:", err);
  }

  return (
    <html lang="en" className={nunito.variable} suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <AppStoreProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-cream shadow-xl">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer categories={categories} />
          </div>
          <CartDrawer />
          <WishlistDrawer />
        </AppStoreProvider>

        <ShiprocketLoader />
      </body>
    </html>
  );
}
