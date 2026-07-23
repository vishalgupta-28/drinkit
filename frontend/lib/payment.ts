import { api } from "./api";

export type PaymentMethod = "upi" | "card" | "cod";

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  method: PaymentMethod;
}

/**
 * Process a payment for an order.
 *
 * Tries the backend payment-service (Razorpay-style create + verify). When no
 * backend is available it SIMULATES a gateway response so the demo flow works.
 *
 * IMPORTANT: this is test-mode only. It does NOT collect real card/UPI
 * credentials and does NOT move real money. Wire real Razorpay checkout with
 * your own keys for production.
 */
export async function processPayment(input: {
  orderId: string;
  amount: number; // INR
  method: PaymentMethod;
}): Promise<PaymentResult> {
  // Cash on delivery: nothing to charge now.
  if (input.method === "cod") {
    return { success: true, paymentId: `cod_${input.orderId}`, method: "cod" };
  }

  try {
    const { data: created } = await api.post(
      "/payments/create",
      { order_id: input.orderId, amount: input.amount },
      { timeout: 6000 },
    );
    // In real Razorpay, the browser SDK opens here and returns a payment id.
    const { data: verified } = await api.post(
      "/payments/verify",
      {
        razorpay_order_id: created.razorpay_order_id,
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_signature: "test",
      },
      { timeout: 6000 },
    );
    return {
      success: !!verified.verified,
      paymentId: verified.payment_id ?? `pay_${input.orderId}`,
      method: input.method,
    };
  } catch {
    // DEV-ONLY offline simulation so the demo flow completes without a gateway.
    // ⚠️ PRODUCTION: do NOT auto-succeed here — a network error must return
    // { success: false } so an unpaid order is never confirmed.
    await new Promise((r) => setTimeout(r, 900));
    return { success: true, paymentId: `pay_sim_${Date.now()}`, method: input.method };
  }
}
