"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import logo from "@/stitch/drinkit-logo/screen.png";
import rider from "@/stitch/delivery-rider-illustration/screen.png";

export default function SplashPage() {
  const router = useRouter();
  const ageVerified = useUserStore((s) => s.ageVerified);

  const start = () => router.push(ageVerified ? "/" : "/");

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-dark p-6 text-white">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-gold/10 blur-[100px]" />

      <div className="relative z-10 mt-12 text-center">
        <img src={logo.src} alt="DrinkIt" className="mx-auto h-20 w-auto" />
        <h1 className="mt-4 text-3xl font-extrabold">DrinkIt</h1>
        <p className="mt-1 text-sm font-medium text-white/70">India&apos;s #1 Alcohol Delivery</p>
        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
          <MapPin size={12} /> Delhi NCR
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-xs">
        <img src={rider.src} alt="Fast delivery" className="w-full rounded-2xl" />
      </div>

      <div className="relative z-10 mb-8 space-y-3 text-center">
        <p className="text-sm text-white/70">Beer, whisky, wine & more delivered in minutes</p>
        <Button size="lg" className="w-full gap-2 rounded-xl bg-primary py-4 text-base font-extrabold" onClick={start}>
          Get Started <ArrowRight size={20} />
        </Button>
        <p className="text-xs text-white/50">Must be 21+ to use DrinkIt</p>
      </div>
    </div>
  );
}
