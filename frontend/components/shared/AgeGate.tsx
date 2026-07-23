"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/userStore";

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
        className="fixed inset-0 z-[200] flex items-center justify-center bg-dark/80 p-6 text-center backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass glass-sheen w-full max-w-sm rounded-2xl p-8 shadow-2xl"
        >
          <div className="mb-4 text-5xl">🥃</div>
          <h1 className="text-2xl font-extrabold text-primary">DrinkIt</h1>
          {rejected ? (
            <p className="mt-6 text-lg font-semibold text-danger">
              Sorry, come back when you&apos;re older 😅
            </p>
          ) : (
            <>
              <p className="mt-2 text-lg font-semibold text-dark">Are you 21 or older?</p>
              <p className="mt-1 text-sm text-muted">
                You must be of legal drinking age to use DrinkIt.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={verifyAge}
                  className="w-full rounded bg-primary py-3 font-bold text-white active:scale-95"
                >
                  Yes, I&apos;m 21+
                </button>
                <button
                  onClick={() => setRejected(true)}
                  className="w-full rounded border border-danger py-3 font-bold text-danger active:scale-95"
                >
                  No
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
