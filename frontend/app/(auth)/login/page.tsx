"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    setLoading(true);
    try {
      await api.post("/auth/otp/request", { phone });
    } catch {
      /* backend optional in dev */
    }
    sessionStorage.setItem("drinkit_phone", phone);
    router.push("/verify");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <div className="text-5xl">🥃</div>
        <h1 className="mt-2 text-2xl font-extrabold text-primary">DrinkIt</h1>
        <p className="text-sm text-muted">Alcohol delivered in minutes</p>
      </div>
      <label className="text-sm font-semibold">Mobile number</label>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91 98111 00000"
        className="mt-1 w-full rounded border border-gray-200 px-4 py-3"
      />
      <button
        onClick={requestOtp}
        disabled={phone.length < 10 || loading}
        className="mt-4 w-full rounded bg-primary py-3 font-bold text-white disabled:opacity-40"
      >
        {loading ? "Sending…" : "Send OTP"}
      </button>
    </div>
  );
}
