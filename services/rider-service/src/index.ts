import express from "express";

const app = express();
app.use(express.json());
const PORT = Number(process.env.PORT ?? 8006);

// Scaffold riders. Replace with Postgres-backed availability + assignment.
const RIDERS = [
  { id: "rider_1", name: "Rahul", rating: 4.8, phone: "+919800000001", available: true },
  { id: "rider_2", name: "Amit", rating: 4.6, phone: "+919800000002", available: true },
];

app.get("/health", (_req, res) => res.json({ status: "ok", service: "rider-service" }));

app.get("/riders", (_req, res) => res.json(RIDERS));

// Assign nearest available rider to an order (scaffold: first available)
app.post("/riders/assign", (req, res) => {
  const rider = RIDERS.find((r) => r.available);
  if (!rider) return res.status(409).json({ error: "no riders available" });
  res.json({ orderId: req.body?.orderId, rider });
});

// Latest live location for a rider (scaffold: jittered around Delhi CP)
app.get("/riders/:id/location", (req, res) => {
  res.json({
    riderId: req.params.id,
    lat: 28.6315 + (Math.random() - 0.5) * 0.01,
    lng: 77.2167 + (Math.random() - 0.5) * 0.01,
    ts: Date.now(),
  });
});

app.listen(PORT, () => console.log(`rider-service listening on ${PORT}`));
