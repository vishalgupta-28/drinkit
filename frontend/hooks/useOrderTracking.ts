"use client";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { OrderStatus } from "@/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8007";

export interface RiderLoc {
  lat: number;
  lng: number;
  etaMin?: number;
}

export interface Rider {
  name: string;
  rating: number;
  phone: string;
}

/**
 * Subscribe to a single order's real-time updates from notification-service.
 * Joins the order's room and listens for order.* / rider.* events pushed over
 * WebSocket. Degrades gracefully: if there's no backend (e.g. the Vercel
 * frontend-only deploy) `connected` stays false and the page shows its
 * default demo state.
 */
export function useOrderTracking(orderId: string) {
  const [status, setStatus] = useState<OrderStatus>("confirmed");
  const [rider, setRider] = useState<Rider | null>(null);
  const [riderLoc, setRiderLoc] = useState<RiderLoc | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const socket = io(WS_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      timeout: 4000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("track:order", orderId);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));

    // notification-service emits with the routing key as the event name.
    socket.onAny((event: string, payload: any) => {
      if (event.startsWith("order.")) {
        const s = event.slice("order.".length); // created | preparing | picked_up | delivered
        setStatus(s === "created" ? "confirmed" : (s as OrderStatus));
      } else if (event === "rider.assigned" && payload?.rider) {
        setRider(payload.rider);
      } else if (event === "rider.location" && payload) {
        setRiderLoc({ lat: payload.lat, lng: payload.lng, etaMin: payload.etaMin });
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [orderId]);

  return { status, rider, riderLoc, connected };
}
