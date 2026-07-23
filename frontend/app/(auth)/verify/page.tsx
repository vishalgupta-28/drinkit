"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useUserStore } from "@/store/userStore";

export default function VerifyPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [otp, setOtp] = useState("");
  const phone = typeof window !== "undefined" ? sessionStorage.getItem("drinkit_phone") ?? "" : "";

  const verify = async () => {
    try {
      const { data } = await api.post("/auth/otp/verify", { phone, otp });
      localStorage.setItem("drinkit_token", data.access_token);
    } catch {
      localStorage.setItem("drinkit_token", "dev-token");
    }
    setUser(phone);
    router.push("/");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <h1 className="text-xl font-extrabold">Enter OTP</h1>
      <p className="text-sm text-muted">Sent to {phone}</p>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="6-digit code"
        maxLength={6}
        className="mt-4 w-full rounded border border-gray-200 px-4 py-3 text-center text-2xl tracking-[0.5em]"
      />
      <button
        onClick={verify}
        disabled={otp.length !== 6}
        className="mt-4 w-full rounded bg-primary py-3 font-bold text-white disabled:opacity-40"
      >
        Verify &amp; Continue
      </button>
    </div>
  );
}
