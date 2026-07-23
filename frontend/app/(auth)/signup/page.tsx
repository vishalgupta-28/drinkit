"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/auth";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const setSession = useUserStore((s) => s.setSession);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const session = await signup({ name, email, password });
      setSession(session);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <div className="text-5xl">🥃</div>
        <h1 className="mt-2 text-2xl font-extrabold text-primary">Create your account</h1>
        <p className="text-sm text-muted">Sign up with email to start ordering</p>
      </div>

      <form onSubmit={submit} className="glass glass-sheen space-y-3 rounded-xl2 p-5">
        <div>
          <label className="text-sm font-semibold">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vishal Gupta"
            className="mt-1 w-full rounded border border-gray-200 bg-white/70 px-4 py-3"
          />
        </div>
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
            placeholder="At least 6 characters"
            className="mt-1 w-full rounded border border-gray-200 bg-white/70 px-4 py-3"
          />
        </div>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating account…" : "Sign up"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}
