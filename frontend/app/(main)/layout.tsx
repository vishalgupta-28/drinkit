import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CartSheet } from "@/components/cart/CartSheet";
import { AgeGate } from "@/components/shared/AgeGate";
import { Toaster } from "@/components/shared/Toaster";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-28">
      <AgeGate />
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-4">{children}</main>
      <Footer />
      <CartSheet />
      <BottomNav />
      <Toaster />
    </div>
  );
}
