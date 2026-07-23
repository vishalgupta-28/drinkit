import { cn } from "@/lib/utils";

/**
 * DrinkIt wordmark — "drink" + "it", with a bottle forming the "i".
 * `dark` renders the light-on-dark variant (white "drink").
 */
export function Logo({
  className,
  tagline = false,
  dark = false,
}: {
  className?: string;
  tagline?: boolean;
  dark?: boolean;
}) {
  return (
    <span className={cn("inline-flex select-none flex-col leading-none", className)}>
      <span className="flex items-center text-2xl font-extrabold tracking-tight">
        <span className={dark ? "text-white" : "text-dark"}>drink</span>
        {/* the "it": a bottle stands in for the dotted i */}
        <span className="relative inline-flex items-center text-primary">
          <BottleI />
          <span>t</span>
        </span>
      </span>
      {tagline && (
        <span
          className={cn(
            "mt-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
            dark ? "text-white/70" : "text-muted",
          )}
        >
          Alcohol. Delivered.
        </span>
      )}
    </span>
  );
}

/** A tiny bottle glyph used as the "i" in drinkit. */
function BottleI() {
  return (
    <svg width="10" height="26" viewBox="0 0 10 26" className="mr-[1px]" aria-hidden>
      {/* cap (the dot of the i) */}
      <rect x="3" y="0" width="4" height="4" rx="1" fill="currentColor" />
      {/* neck */}
      <rect x="3.5" y="4" width="3" height="4" fill="currentColor" />
      {/* body */}
      <path d="M2 10c0-1 1-2 3-2s3 1 3 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10Z" fill="currentColor" />
    </svg>
  );
}
