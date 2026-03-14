import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartDrawerContent } from "@/components/cart/CartDrawerContent";
import { CartSyncBridge } from "@/components/cart/CartSyncBridge";

export const metadata: Metadata = {
  title: "ShopNova Luxury Commerce",
  description: "Production-grade dark luxury eCommerce platform"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-luxury-bg text-luxury-white antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <CartSyncBridge />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer>
              <CartDrawerContent />
            </CartDrawer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
