import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.get("/health", (_req, res) => res.json({ status: "ok", service: "api-gateway" }));

// Route /api/<svc>/* to the matching microservice.
// In production Nginx also does this; the gateway adds auth, rate-limiting, etc.
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
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: (p) => p.replace(path, ""),
    }),
  );
}

app.listen(PORT, () => console.log(`api-gateway listening on ${PORT}`));
