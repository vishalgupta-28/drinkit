import { createServer } from "http";
import { Server } from "socket.io";
import amqp from "amqplib";

const PORT = Number(process.env.PORT ?? 8007);
const RABBIT = process.env.RABBITMQ_URL ?? "amqp://drinkit:drinkit_secret@rabbitmq:5672/";

const httpServer = createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "notification-service" }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: { origin: "*" },
  path: "/socket.io/",
});

io.on("connection", (socket) => {
  console.log("client connected:", socket.id);

  // Client joins a room per order to receive live rider updates
  socket.on("track:order", (orderId: string) => {
    socket.join(`order:${orderId}`);
  });

  socket.on("disconnect", () => console.log("client disconnected:", socket.id));
});

// Consume order/rider events from RabbitMQ and fan out over WebSocket
async function consumeEvents() {
  try {
    const conn = await amqp.connect(RABBIT);
    const ch = await conn.createChannel();
    await ch.assertExchange("drinkit.events", "topic", { durable: true });
    const q = await ch.assertQueue("", { exclusive: true });
    await ch.bindQueue(q.queue, "drinkit.events", "order.*");
    await ch.bindQueue(q.queue, "drinkit.events", "rider.*");

    ch.consume(q.queue, (msg) => {
      if (!msg) return;
      const routingKey = msg.fields.routingKey;
      const payload = JSON.parse(msg.content.toString());
      const orderId = payload.orderId ?? payload.id;
      if (orderId) io.to(`order:${orderId}`).emit(routingKey, payload);
      ch.ack(msg);
    });
    console.log("subscribed to drinkit.events");
  } catch (err) {
    console.error("rabbitmq consume failed, retrying in 5s:", err);
    setTimeout(consumeEvents, 5000);
  }
}

httpServer.listen(PORT, () => {
  console.log(`notification-service (socket.io) listening on ${PORT}`);
  consumeEvents();
});
