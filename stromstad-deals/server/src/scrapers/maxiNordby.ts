/**
 * Maxi Mat Nordby scraper
 * URL: https://www.maximatnordby.se/
 *
 * This is a border store near Strömstad. The site is typically simpler HTML.
 * We scrape their weekly offers page.
 */

import { fetchHtml } from "../utils/http.js";
import type { Product } from "../../../shared/types.js";
import { randomUUID } from "crypto";

const BASE_URL = "https://www.maximatnordby.se";
// Try common offer page paths
const OFFER_PATHS = ["/erbjudanden", "/veckans-erbjudanden", "/kampanj", "/"];

async function tryScrapePath(path: string): Promise<Product[]> {
  const url = `${BASE_URL}${path}`;
  const $ = await fetchHtml(url);
  const products: Product[] = [];

  // Look for product/offer elements with broad selectors
  const candidates = [
    "[class*='product']",
    "[class*='offer']",
    "[class*='kampanj']",
    "[class*='erbjudande']",
    "article",
    ".card",
    "li.item",
  ].join(", ");

  $(candidates).each((_, el) => {
    const name =
      $(el).find("[class*='title'], [class*='name'], [class*='product-name'], h2, h3, h4")
        .first()
        .text()
        .trim();

    const priceText = $(el)
      .find("[class*='price']:not([class*='compare']):not([class*='original'])")
      .first()
      .text()
      .trim();

    const imgEl = $(el).find("img").first();
    const imageUrl = imgEl.attr("src") ?? imgEl.attr("data-src") ?? imgEl.attr("data-lazy");

    if (!name || name.length < 2) return;
    const price = parseSwedishPrice(priceText);
    if (price === null || price <= 0 || price > 10_000) return;

    products.push({
      id: randomUUID(),
      name,
      price,
      imageUrl: imageUrl ? resolveUrl(BASE_URL, imageUrl) : undefined,
      store: "maxiNordby",
      scrapedAt: Date.now(),
    });
  });

  // Deduplicate by name
  const seen = new Set<string>();
  return products.filter((p) => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });
}

export async function scrapeMaxiNordby(): Promise<Product[]> {
  for (const path of OFFER_PATHS) {
    try {
      const products = await tryScrapePath(path);
      if (products.length > 0) {
        console.log(`[Maxi Nordby] Fetched ${products.length} products from ${path}`);
        return products;
      }
    } catch (err) {
      console.warn(`[Maxi Nordby] Failed path ${path}: ${String(err)}`);
    }
  }
  console.error("[Maxi Nordby] All paths failed.");
  return [];
}

function parseSwedishPrice(text: string): number | null {
  if (!text) return null;
  const cleaned = text.replace(/[^\d,.:]/g, "").replace(",", ".").replace(":", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function resolveUrl(base: string, url: string): string {
  if (!url || url.startsWith("data:")) return "";
  if (url.startsWith("http")) return url;
  try {
    return new URL(url, base).href;
  } catch {
    return "";
  }
}
