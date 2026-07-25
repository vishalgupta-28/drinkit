"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import bg from "@/stitch/alcohol-bottles-background/screen.png";

export function AgeGate() {
  const ageVerified = useUserStore((s) => s.ageVerified);
  const verifyAge = useUserStore((s) => s.verifyAge);
  const [mounted, setMounted] = useState(false);
  const [rejected, setRejected] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || ageVerified) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[200] flex items-end justify-center bg-dark p-0 text-center sm:items-center sm:p-6"
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg.src})` }}
        />
        <div className="absolute inset-0 bg-dark/80" />

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass relative z-10 w-full max-w-sm rounded-t-3xl p-8 shadow-2xl sm:rounded-3xl"
        >
          <div className="mb-4 text-5xl">🥃</div>
          <h1 className="text-2xl font-extrabold text-white">DrinkIt</h1>
          {rejected ? (
            <p className="mt-6 text-lg font-semibold text-danger">
              Sorry, come back when you&apos;re older 😅
            </p>
          ) : (
            <>
              <p className="mt-2 text-lg font-semibold text-white">Age Verification</p>
              <p className="mt-1 text-sm text-white/70">
                You must be 21 or older to enter. Please confirm your age.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={verifyAge}
                  className="w-full rounded-xl bg-primary py-3.5 font-bold text-white shadow-lg active:scale-95"
                >
                  Yes, I&apos;m 21+
                </button>
                <button
                  onClick={() => setRejected(true)}
                  className="w-full rounded-xl border border-white/30 py-3.5 font-bold text-white active:scale-95"
                >
                  No, I&apos;m under 21
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
