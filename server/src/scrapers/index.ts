import { scrapeIca } from "./ica.js";
import { scrapeWillys } from "./willys.js";
import { scrapeMaxiNordby } from "./maxiNordby.js";
import { scrapeEurocash } from "./eurocash.js";
import { writeCache, readCache } from "../utils/cache.js";
import type { Product, StoreId } from "../../../shared/types.js";

export type { Product };

/**
 * Run all scrapers in parallel and merge results into the cache.
 * Returns all products (from all stores).
 */
export async function scrapeAll(): Promise<Product[]> {
  console.log("[Scraper] Starting all scrapers...");

  const [ica, willys, maxiNordby, eurocash] = await Promise.allSettled([
    scrapeIca(),
    scrapeWillys(),
    scrapeMaxiNordby(),
    scrapeEurocash(),
  ]);

  const storesUpdated: StoreId[] = [];
  const products: Product[] = [];

  if (ica.status === "fulfilled" && ica.value.length > 0) {
    products.push(...ica.value);
    storesUpdated.push("ica");
  }
  if (willys.status === "fulfilled" && willys.value.length > 0) {
    products.push(...willys.value);
    storesUpdated.push("willys");
  }
  if (maxiNordby.status === "fulfilled" && maxiNordby.value.length > 0) {
    products.push(...maxiNordby.value);
    storesUpdated.push("maxiNordby");
  }
  if (eurocash.status === "fulfilled" && eurocash.value.length > 0) {
    products.push(...eurocash.value);
    storesUpdated.push("eurocash");
  }

  const cache = {
    products,
    lastUpdated: Date.now(),
    storesUpdated,
  };

  writeCache(cache);
  console.log(
    `[Scraper] Done. ${products.length} products from: ${storesUpdated.join(", ")}`
  );

  return products;
}

/** Return cached products, running scrapers if cache is empty or stale. */
export async function getProducts(forceRefresh = false): Promise<{
  products: Product[];
  lastUpdated: number;
  storesUpdated: StoreId[];
}> {
  const MAX_AGE_MS = 12 * 60 * 60 * 1000; // 12 hours

  const cache = readCache();
  const isStale = !cache || Date.now() - cache.lastUpdated > MAX_AGE_MS;

  if (forceRefresh || isStale) {
    await scrapeAll();
    return readCache() ?? { products: [], lastUpdated: Date.now(), storesUpdated: [] };
  }

  return cache;
}
