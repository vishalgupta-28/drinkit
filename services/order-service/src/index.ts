import express from "express";
import { z } from "zod";
import amqp, { type Channel } from "amqplib";

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT ?? 8005);
const RABBIT = process.env.RABBITMQ_URL ?? "amqp://drinkit:drinkit_secret@rabbitmq:5672/";

// In-memory store for scaffold. Replace with Postgres (pg).
type Order = { id: string; items: unknown[]; total: number; status: string; zone: string };
const ORDERS = new Map<string, Order>();

const CreateOrder = z
  .object({
    orderId: z.string().optional(), // client can supply the id it will track
    zone: z.string(),
    items: z.array(z.object({ productId: z.string(), qty: z.number().int().positive() })),
    total: z.number().positive(),
  })
  .passthrough(); // allow extra fields (address, payment)

// ── Shared RabbitMQ channel (reconnects on failure) ───────────
let channel: Channel | null = null;
async function initRabbit() {
  try {
    const conn = await amqp.connect(RABBIT);
    conn.on("error", () => (channel = null));
    conn.on("close", () => {
      channel = null;
      setTimeout(initRabbit, 3000);
    });
    channel = await conn.createChannel();
    await channel.assertExchange("drinkit.events", "topic", { durable: true });
    console.log("order-service connected to RabbitMQ");
  } catch (err) {
    console.error("rabbitmq connect failed, retrying in 3s");
    setTimeout(initRabbit, 3000);
  }
}

function publishEvent(event: string, payload: Record<string, unknown>) {
  if (!channel) return;
  channel.publish("drinkit.events", event, Buffer.from(JSON.stringify(payload)));
}

// Simulate an order's lifecycle so the tracking page updates in real time.
// (In production these events come from the shop, rider app, and dispatcher.)
function simulateProgress(orderId: string) {
  const at = (ms: number, event: string, extra: Record<string, unknown> = {}) =>
    setTimeout(() => publishEvent(event, { orderId, ...extra }), ms);

  at(4000, "order.preparing");
  at(7000, "rider.assigned", { rider: { name: "Rahul", rating: 4.8, phone: "+919800000001" } });
  at(10000, "order.picked_up");

  // rider moving toward the customer (Delhi CP baseline), ETA counting down
  const base = { lat: 28.6315, lng: 77.2167 };
  let t = 12000;
  for (let i = 1; i <= 5; i++) {
    at(t, "rider.location", {
      lat: base.lat + i * 0.0012,
      lng: base.lng + i * 0.0012,
      etaMin: Math.max(1, 8 - i * 2),
    });
    t += 4000;
  }
  at(t + 1000, "order.delivered");
}

app.get("/health", (_req, res) => res.json({ status: "ok", service: "order-service" }));

app.post("/orders", (req, res) => {
  const parsed = CreateOrder.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const id = parsed.data.orderId ?? `ord_${Date.now()}`;
  const order: Order = {
    id,
    zone: parsed.data.zone,
    items: parsed.data.items,
    total: parsed.data.total,
    status: "confirmed",
  };
  ORDERS.set(id, order);

  publishEvent("order.created", { orderId: id, ...order });
  simulateProgress(id); // drives the live tracking timeline
  res.status(201).json(order);
});

app.get("/orders/:id", (req, res) => {
  const order = ORDERS.get(req.params.id);
  if (!order) return res.status(404).json({ error: "not found" });
  res.json(order);
});

app.listen(PORT, () => {
  console.log(`order-service listening on ${PORT}`);
  initRabbit();
});
