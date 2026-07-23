"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Trophy, ShoppingBag, MapPin } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { useRewardsStore } from "@/store/rewardsStore";
import { useZoneStore } from "@/store/zoneStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  const router = useRouter();
  const { name, email, token, logout } = useUserStore();
  const points = useRewardsStore((s) => s.points);
  const zone = useZoneStore((s) => s.zone);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl">👤</div>
        <h1 className="mt-3 text-xl font-extrabold">You&apos;re not logged in</h1>
        <p className="mt-1 text-sm text-muted">Log in to track orders and earn DrinkPoints.</p>
        <div className="mt-4 flex gap-2">
          <Button asChild><Link href="/login">Log in</Link></Button>
          <Button asChild variant="outline"><Link href="/signup">Sign up</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-4 p-5">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-2xl text-white">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-extrabold">{name}</h1>
          <p className="truncate text-sm text-muted">{email}</p>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Link href="/rewards"><Card className="flex flex-col items-center gap-1 p-4 text-center"><Trophy className="text-gold" size={22} /><span className="text-sm font-bold">{points}</span><span className="text-[11px] text-muted">Points</span></Card></Link>
        <Link href="/orders"><Card className="flex flex-col items-center gap-1 p-4 text-center"><ShoppingBag className="text-primary" size={22} /><span className="text-sm font-bold">Orders</span><span className="text-[11px] text-muted">History</span></Card></Link>
        <Card className="flex flex-col items-center gap-1 p-4 text-center"><MapPin className="text-danger" size={22} /><span className="text-sm font-bold">{zone.city}</span><span className="text-[11px] text-muted">Zone</span></Card>
      </div>

      <Button
        variant="danger"
        className="w-full"
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        <LogOut size={16} /> Log out
      </Button>
    </div>
  );
}
