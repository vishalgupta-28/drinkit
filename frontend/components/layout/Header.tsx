"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, ChevronDown, ShoppingCart, MapPin, Check,
  User, LogOut, Trophy, Package, Coins,
} from "lucide-react";
import { useZoneStore } from "@/store/zoneStore";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useUiStore } from "@/store/uiStore";
import { useSearchStore } from "@/store/searchStore";
import { useStoreStatus } from "@/hooks/useStoreStatus";
import { Logo } from "@/components/brand/Logo";
import { ZONES, ZONE_SHOP } from "@/lib/mock";
import { formatINR } from "@/lib/utils";

const PLACEHOLDERS = ['"whisky"', '"cold beer"', '"red wine"', '"vodka"', '"party pack"'];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { zone, shopName, setZone, setShopName } = useZoneStore();
  const count = useCartStore((s) => s.count);
  const subtotal = useCartStore((s) => s.subtotal);
  const openCart = useUiStore((s) => s.openCart);
  const { name, token, logout } = useUserStore();
  const { query, setQuery } = useSearchStore();
  const status = useStoreStatus();

  const [locOpen, setLocOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [ph, setPh] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // rotating search placeholder
  useEffect(() => {
    const t = setInterval(() => setPh((i) => (i + 1) % PLACEHOLDERS.length), 2500);
    return () => clearInterval(t);
  }, []);

  // close menus on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setLocOpen(false);
        setAcctOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const n = count();

  const onSearch = (v: string) => {
    setQuery(v);
    if (pathname !== "/search") router.push("/search");
  };

  return (
    <header ref={rootRef} className="glass sticky top-0 z-40 border-b border-white/50">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 md:gap-5">
        {/* Logo */}
        <Link href="/" className="shrink-0" aria-label="DrinkIt home">
          <Logo />
        </Link>

        {/* Location / store status */}
        <div className="relative min-w-0">
          <button
            onClick={() => { setLocOpen((o) => !o); setAcctOpen(false); }}
            className="flex min-w-0 items-start gap-1 text-left"
          >
            <div className="min-w-0">
              <p className={`text-sm font-extrabold leading-tight ${status.open ? "text-dark" : "text-danger"}`}>
                {status.open ? "Delivery in 12 mins" : "Store Closed"}
              </p>
              <p className="flex items-center gap-1 truncate text-xs text-muted">
                <span className="font-semibold text-dark">{shopName}</span>
                <span className="truncate">· {zone.name}</span>
                <ChevronDown size={13} className={`shrink-0 ${locOpen ? "rotate-180" : ""} transition`} />
              </p>
            </div>
          </button>

          {locOpen && (
            <div className="glass absolute left-0 top-full z-50 mt-2 w-72 rounded-xl2 border border-white/60 p-3 shadow-xl">
              <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-muted">
                <MapPin size={13} /> Select delivery city — prices vary
              </p>
              <div className="grid gap-1.5">
                {ZONES.map((z) => {
                  const active = z.slug === zone.slug;
                  return (
                    <button
                      key={z.slug}
                      onClick={() => {
                        setZone(z);
                        setShopName(ZONE_SHOP[z.slug] ?? "Local Store");
                        setLocOpen(false);
                      }}
                      className={`flex items-center justify-between rounded-lg border p-2.5 text-left text-sm ${
                        active ? "border-primary bg-primary-light text-primary" : "border-gray-200 bg-white/60"
                      }`}
                    >
                      <span>
                        <span className="font-semibold">{z.name}</span>
                        <span className="block text-xs text-muted">{ZONE_SHOP[z.slug]}</span>
                      </span>
                      {active && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="hidden flex-1 items-center gap-2 rounded-xl2 border border-gray-200 bg-white/70 px-3 py-2.5 md:flex">
          <Search size={18} className="text-muted" />
          <input
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => pathname !== "/search" && router.push("/search")}
            placeholder={`Search ${PLACEHOLDERS[ph]}`}
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        {/* Account */}
        <div className="relative ml-auto md:ml-0">
          <button
            onClick={() => { setAcctOpen((o) => !o); setLocOpen(false); }}
            className="hidden items-center gap-1 text-sm font-semibold text-dark sm:flex"
          >
            {token ? name.split(" ")[0] : "Account"}
            <ChevronDown size={15} className={`${acctOpen ? "rotate-180" : ""} transition`} />
          </button>
          {/* mobile: icon only */}
          <Link href={token ? "/profile" : "/login"} className="sm:hidden" aria-label="Account">
            <User size={20} className="text-dark" />
          </Link>

          {acctOpen && (
            <div className="glass absolute right-0 top-full z-50 mt-2 w-56 rounded-xl2 border border-white/60 p-1.5 shadow-xl">
              {token ? (
                <>
                  <div className="border-b border-white/60 px-3 py-2">
                    <p className="text-sm font-bold">{name}</p>
                  </div>
                  <Item href="/rewards" Icon={Trophy} label="DrinkPoints" onClick={() => setAcctOpen(false)} />
                  <Item href="/orders" Icon={Package} label="My Orders" onClick={() => setAcctOpen(false)} />
                  <Item href="/profile" Icon={User} label="Profile" onClick={() => setAcctOpen(false)} />
                  <button
                    onClick={() => { logout(); setAcctOpen(false); router.push("/"); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-danger hover:bg-black/5"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </>
              ) : (
                <>
                  <Item href="/login" Icon={User} label="Log in" onClick={() => setAcctOpen(false)} />
                  <Item href="/signup" Icon={Coins} label="Create account" onClick={() => setAcctOpen(false)} />
                </>
              )}
            </div>
          )}
        </div>

        {/* Cart (desktop) */}
        <button
          onClick={openCart}
          className="hidden items-center gap-2 rounded-xl2 bg-primary px-4 py-2.5 font-bold text-white md:flex"
        >
          <ShoppingCart size={18} />
          {n > 0 ? (
            <span className="text-sm leading-tight">
              {n} item{n > 1 ? "s" : ""}
              <span className="block text-xs font-semibold">{formatINR(subtotal())}</span>
            </span>
          ) : (
            <span className="text-sm">My Cart</span>
          )}
        </button>
      </div>

      {/* Search row (mobile) */}
      <div className="flex items-center gap-2 border-t border-white/50 px-4 py-2 md:hidden">
        <Search size={17} className="text-muted" />
        <input
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => pathname !== "/search" && router.push("/search")}
          placeholder={`Search ${PLACEHOLDERS[ph]}`}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </header>
  );
}

function Item({
  href, Icon, label, onClick,
}: {
  href: string;
  Icon: typeof User;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-dark hover:bg-black/5"
    >
      <Icon size={16} /> {label}
    </Link>
  );
}
