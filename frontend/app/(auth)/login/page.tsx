"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useUserStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const session = await login({ email, password });
      setSession(session);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <div className="text-5xl">🥃</div>
        <h1 className="mt-2 text-2xl font-extrabold text-primary">Welcome back</h1>
        <p className="text-sm text-muted">Log in to DrinkIt</p>
      </div>

      <form onSubmit={submit} className="glass glass-sheen space-y-3 rounded-xl2 p-5">
        <div>
          <label className="text-sm font-semibold">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded border border-gray-200 bg-white/70 px-4 py-3"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1 w-full rounded border border-gray-200 bg-white/70 px-4 py-3"
          />
        </div>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        New to DrinkIt?{" "}
        <Link href="/signup" className="font-bold text-primary">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-muted">
        Or{" "}
        <Link href="/phone" className="font-bold text-primary">
          log in with phone
        </Link>
      </p>
    </div>
  );
}
