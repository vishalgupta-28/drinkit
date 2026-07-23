import Link from "next/link";

const USEFUL = ["Blog", "Privacy", "Terms", "FAQs", "Security", "Contact", "Partner", "Franchise", "Careers"];
const CATEGORIES = [
  "🍺 Beer", "🥃 Whisky", "🍷 Wine", "🍸 Vodka", "🥃 Rum", "🍹 Gin",
  "🥂 Champagne", "🧊 Mixers", "🎁 Gift Packs", "🍾 Premium",
];

export function Footer() {
  return (
    <footer className="mt-8 border-t border-white/40 bg-white/40 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <div>
            <h4 className="mb-3 text-sm font-extrabold text-dark">Useful Links</h4>
            <ul className="grid grid-cols-2 gap-y-2 text-sm text-muted">
              {USEFUL.map((l) => (
                <li key={l}>
                  <Link href="#" className="hover:text-primary">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2">
            <h4 className="mb-3 text-sm font-extrabold text-dark">
              Categories <span className="ml-1 text-primary">see all</span>
            </h4>
            <ul className="grid grid-cols-2 gap-y-2 text-sm text-muted sm:grid-cols-3">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link href="/search" className="hover:text-primary">{c}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/40 pt-5 text-xs text-muted sm:flex-row">
          <p>© DrinkIt Technologies Pvt. Ltd., 2024–2026</p>
          <p className="max-w-md text-center sm:text-right">
            Drink responsibly. Sale of liquor is permitted only to persons of 21 years and above.
          </p>
        </div>
      </div>
    </footer>
  );
}
