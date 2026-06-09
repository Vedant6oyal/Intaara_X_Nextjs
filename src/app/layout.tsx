import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppStoreProvider } from "@/store/AppStore";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Intaara · Gift & Redeem",
  description:
    "Pick free anti-tarnish jewellery gifts worth up to ₹1000, then redeem them with your purchase.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#7c9885",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppStoreProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-cream shadow-xl">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
          <CartDrawer />
        </AppStoreProvider>
      </body>
    </html>
  );
}
