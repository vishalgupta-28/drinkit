"use client";
import { create } from "zustand";
import { AnimatePresence, motion } from "framer-motion";

interface Toast {
  id: string;
  message: string;
}
interface ToastState {
  toasts: Toast[];
  show: (message: string) => void;
}

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  show: (message) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2200);
  },
}));

export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  return (
    <div className="fixed bottom-24 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="rounded bg-dark px-4 py-2 text-sm font-medium text-white shadow-lg"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
