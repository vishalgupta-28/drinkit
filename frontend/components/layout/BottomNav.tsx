"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Gift, Trophy, User } from "lucide-react";

const NAV = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/search", label: "Search", Icon: Search },
  { href: "/spin", label: "Spin", Icon: Gift },
  { href: "/rewards", label: "Rewards", Icon: Trophy },
  { href: "/profile", label: "Profile", Icon: User },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="glass fixed bottom-0 left-0 right-0 z-40 border-t md:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-around">
        {NAV.map(({ href, label, Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
                active ? "text-primary" : "text-muted"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
