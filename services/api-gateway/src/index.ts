import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// CORS for frontend dev
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get("/health", (_req, res) => res.json({ status: "ok", service: "api-gateway" }));

// Route /api/<svc>/* to the matching microservice.
// Strip only the /api prefix so services receive their own router prefix (e.g. /auth, /catalog).
const routes: Record<string, string> = {
  "/api/auth": "http://auth-service:8001",
  "/api/location": "http://location-service:8002",
  "/api/shops": "http://shop-service:8003",
  "/api/catalog": "http://catalog-service:8004",
  "/api/orders": "http://order-service:8005",
  "/api/riders": "http://rider-service:8006",
  "/api/payments": "http://payment-service:8008",
  "/api/analytics": "http://analytics-service:8009",
};

for (const [path, target] of Object.entries(routes)) {
  // Express strips the mount point before pathRewrite is called; restore the service prefix.
  const servicePrefix = path.replace(/^\/api/, "");
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (p) => servicePrefix + p,
    }),
  );
}

app.listen(PORT, () => console.log(`api-gateway listening on ${PORT}`));
