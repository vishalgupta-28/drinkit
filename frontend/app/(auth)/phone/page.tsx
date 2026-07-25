"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, ArrowRight } from "lucide-react";
import { requestOtp } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function PhoneLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone.trim() || phone.length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    const full = phone.startsWith("+") ? phone : `+91${phone}`;
    setLoading(true);
    try {
      await requestOtp(full);
      router.push(`/otp?phone=${encodeURIComponent(full)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-light text-3xl text-primary">
          <Smartphone />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-dark">What&apos;s your number?</h1>
        <p className="text-sm text-muted">We&apos;ll send a 6-digit OTP to verify you.</p>
      </div>

      <form onSubmit={submit} className="glass glass-sheen space-y-4 rounded-xl2 p-5">
        <div>
          <label className="text-sm font-semibold">Mobile number</label>
          <div className="mt-1 flex overflow-hidden rounded border border-gray-200 bg-white/70">
            <span className="flex items-center border-r border-gray-200 px-3 text-sm font-semibold text-muted">+91</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="9811100000"
              className="w-full bg-transparent px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Sending OTP…" : "Continue"} <ArrowRight size={18} />
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        Prefer email?{" "}
        <Button variant="ghost" className="h-auto p-0 font-bold" onClick={() => router.push("/login")}>
          Log in with email
        </Button>
      </p>
    </div>
  );
}
