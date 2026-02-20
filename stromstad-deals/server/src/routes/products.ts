import { Router } from "express";
import { getProducts } from "../scrapers/index.js";

export const productsRouter = Router();

/** GET /api/products — return all cached products, refresh if stale */
productsRouter.get("/", async (req, res) => {
  try {
    const force = req.query.refresh === "true";
    const data = await getProducts(force);
    res.json(data);
  } catch (err) {
    console.error("[API] /products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/** GET /api/products/compare?name=<productName> — find same product across stores */
productsRouter.get("/compare", async (req, res) => {
  const name = String(req.query.name ?? "").trim().toLowerCase();
  if (!name) {
    res.status(400).json({ error: "name query param required" });
    return;
  }

  try {
    const { products } = await getProducts();
    const terms = name.split(/\s+/).filter(Boolean);

    const matches = products
      .filter((p) => {
        const lc = p.name.toLowerCase();
        return terms.some((t) => lc.includes(t));
      })
      .sort((a, b) => a.price - b.price);

    res.json({ name, matches });
  } catch (err) {
    console.error("[API] /compare error:", err);
    res.status(500).json({ error: "Failed to compare products" });
  }
});

/** POST /api/products/refresh — trigger a manual re-scrape */
productsRouter.post("/refresh", async (_req, res) => {
  try {
    const data = await getProducts(true);
    res.json({ success: true, count: data.products.length, storesUpdated: data.storesUpdated });
  } catch (err) {
    console.error("[API] /refresh error:", err);
    res.status(500).json({ error: "Refresh failed" });
  }
});
