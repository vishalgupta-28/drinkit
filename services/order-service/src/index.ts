import express from "express";
import { z } from "zod";
import amqp from "amqplib";

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT ?? 8005);
const RABBIT = process.env.RABBITMQ_URL ?? "amqp://drinkit:drinkit_secret@rabbitmq:5672/";

// In-memory store for scaffold. Replace with Postgres (pg).
type Order = { id: string; items: unknown[]; total: number; status: string; zone: string };
const ORDERS = new Map<string, Order>();

const CreateOrder = z.object({
  zone: z.string(),
  items: z.array(z.object({ productId: z.string(), qty: z.number().int().positive() })),
  total: z.number().positive(),
});

async function publishEvent(event: string, payload: unknown) {
  try {
    const conn = await amqp.connect(RABBIT);
    const ch = await conn.createChannel();
    await ch.assertExchange("drinkit.events", "topic", { durable: true });
    ch.publish("drinkit.events", event, Buffer.from(JSON.stringify(payload)));
    setTimeout(() => conn.close(), 500);
  } catch (err) {
    console.error("rabbitmq publish failed:", err);
  }
}

app.get("/health", (_req, res) => res.json({ status: "ok", service: "order-service" }));

app.post("/orders", async (req, res) => {
  const parsed = CreateOrder.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const id = `ord_${Date.now()}`;
  const order: Order = { id, ...parsed.data, status: "confirmed" };
  ORDERS.set(id, order);

  // notify rider-service + notification-service via RabbitMQ
  await publishEvent("order.created", order);
  res.status(201).json(order);
});

app.get("/orders/:id", (req, res) => {
  const order = ORDERS.get(req.params.id);
  if (!order) return res.status(404).json({ error: "not found" });
  res.json(order);
});

app.listen(PORT, () => console.log(`order-service listening on ${PORT}`));
