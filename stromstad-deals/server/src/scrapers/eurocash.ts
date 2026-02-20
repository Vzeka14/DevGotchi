/**
 * Eurocash Strömstad scraper
 * URL: https://www.eurocash.se/butiker/stromstad/
 *
 * Eurocash is a convenience/wholesale chain in Sweden.
 * We scrape their store page and any linked offer pages.
 */

import { fetchHtml } from "../utils/http.js";
import type { Product } from "../../../shared/types.js";
import { randomUUID } from "crypto";

const BASE_URL = "https://www.eurocash.se";
const STORE_URL = `${BASE_URL}/butiker/stromstad/`;
const OFFER_PATHS = ["/erbjudanden", "/kampanjer", "/veckans-priser"];

async function tryScrapePath(url: string): Promise<Product[]> {
  const $ = await fetchHtml(url);
  const products: Product[] = [];

  const candidates = [
    "[class*='product']",
    "[class*='offer']",
    "[class*='item']",
    "[class*='campaign']",
    "article",
  ].join(", ");

  $(candidates).each((_, el) => {
    const name = $(el)
      .find("[class*='title'], [class*='name'], h2, h3, h4")
      .first()
      .text()
      .trim();

    const priceText = $(el)
      .find("[class*='price']:not([class*='original']):not([class*='compare'])")
      .first()
      .text()
      .trim();

    const imgEl = $(el).find("img").first();
    const imageUrl = imgEl.attr("src") ?? imgEl.attr("data-src");

    if (!name || name.length < 2) return;
    const price = parseSwedishPrice(priceText);
    if (price === null || price <= 0 || price > 10_000) return;

    products.push({
      id: randomUUID(),
      name,
      price,
      imageUrl: imageUrl ? resolveUrl(BASE_URL, imageUrl) : undefined,
      store: "eurocash",
      scrapedAt: Date.now(),
    });
  });

  const seen = new Set<string>();
  return products.filter((p) => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });
}

export async function scrapeEurocash(): Promise<Product[]> {
  // First discover offer links from the store page
  try {
    const $ = await fetchHtml(STORE_URL);
    const offerLinks: string[] = [];

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") ?? "";
      if (/erbjudand|kampanj|pris/i.test(href)) {
        offerLinks.push(href.startsWith("http") ? href : `${BASE_URL}${href}`);
      }
    });

    for (const link of [...new Set(offerLinks)].slice(0, 3)) {
      try {
        const products = await tryScrapePath(link);
        if (products.length > 0) {
          console.log(`[Eurocash] Fetched ${products.length} products from ${link}`);
          return products;
        }
      } catch {
        // try next
      }
    }
  } catch (err) {
    console.warn(`[Eurocash] Store page failed: ${String(err)}`);
  }

  // Try known paths
  for (const p of OFFER_PATHS) {
    try {
      const products = await tryScrapePath(`${BASE_URL}${p}`);
      if (products.length > 0) {
        console.log(`[Eurocash] Fetched ${products.length} products from ${p}`);
        return products;
      }
    } catch {
      // try next
    }
  }

  console.error("[Eurocash] All paths failed.");
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
