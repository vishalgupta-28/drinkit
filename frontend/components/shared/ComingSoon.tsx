export function ComingSoon({ title, emoji, note }: { title: string; emoji: string; note?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl">{emoji}</div>
      <h1 className="mt-3 text-xl font-extrabold">{title}</h1>
      <p className="mt-1 max-w-xs text-sm text-muted">
        {note ?? "This screen is scaffolded and ready for you to build out."}
      </p>
    </div>
  );
}
