"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft, RotateCcw } from "lucide-react";
import { verifyOtp } from "@/lib/auth";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";

export default function OtpVerifyPage() {
  const router = useRouter();
  const setSession = useUserStore((s) => s.setSession);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("phone");
    if (p) setPhone(p);
  }, []);

  useEffect(() => {
    if (otp.length === 6 && phone) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!phone) return;
    setError(null);
    setLoading(true);
    try {
      const session = await verifyOtp({ phone, otp });
      setSession(session);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-light text-3xl text-primary">
          <ShieldCheck />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-dark">Verify OTP</h1>
        <p className="text-sm text-muted">Enter the 6-digit code sent to {phone || "your number"}</p>
      </div>

      <form onSubmit={submit} className="glass glass-sheen space-y-4 rounded-xl2 p-5 text-center">
        <input
          type="tel"
          inputMode="numeric"
          maxLength={6}
          autoFocus
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          className="w-full rounded border border-gray-200 bg-white/70 py-3 text-center text-2xl font-extrabold tracking-[0.5em] outline-none"
        />

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={otp.length < 6 || loading}>
          {loading ? "Verifying…" : "Verify & Continue"}
        </Button>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Button variant="ghost" size="sm" className="h-auto gap-1 p-0 text-muted" onClick={() => router.push("/phone")}>
            <ArrowLeft size={14} /> Change number
          </Button>
          <Button variant="ghost" size="sm" className="h-auto gap-1 p-0 text-muted" onClick={() => router.push(`/phone`)}>
            <RotateCcw size={14} /> Resend
          </Button>
        </div>
      </form>
    </div>
  );
}
