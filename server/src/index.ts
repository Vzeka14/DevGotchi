import express from "express";
import cors from "cors";
import cron from "node-cron";
import { productsRouter } from "./routes/products.js";
import { scrapeAll } from "./scrapers/index.js";
import { isCacheStale } from "./utils/cache.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/products", productsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ── Scheduled scraping: every 3 hours ─────────────────────────────────────────
cron.schedule("0 */3 * * *", async () => {
  console.log("[Cron] Running scheduled scrape...");
  await scrapeAll();
});

// ── Startup: scrape if cache is missing or stale ───────────────────────────────
app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);

  if (isCacheStale()) {
    console.log("[Startup] Cache is stale — starting initial scrape...");
    scrapeAll().catch(console.error);
  } else {
    console.log("[Startup] Using existing cache.");
  }
});
