import { Zap, PackageOpen, Tag, ShieldCheck } from "lucide-react";

const FEATURES = [
  { Icon: Zap, title: "10–30 mins Delivery", sub: "At your doorstep" },
  { Icon: PackageOpen, title: "Wide Selection", sub: "1000+ Products" },
  { Icon: Tag, title: "Best Prices", sub: "Unbeatable deals" },
  { Icon: ShieldCheck, title: "100% Secure", sub: "Safe payments" },
];

export function FeatureStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-xl2 bg-dark p-4 text-white md:grid-cols-4">
      {FEATURES.map(({ Icon, title, sub }) => (
        <div key={title} className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/20 text-primary">
            <Icon size={18} style={{ color: "#5fd873" }} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight">{title}</p>
            <p className="truncate text-xs text-white/60">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
