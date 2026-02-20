/**
 * Willys scraper
 * URL: https://www.willys.se/erbjudanden/ehandel
 *
 * Willys (Axfood) has a JSON API embedded in their page responses.
 * We try their product search API first, then fall back to HTML.
 */

import { fetchJson, fetchHtml } from "../utils/http.js";
import type { Product } from "../../../shared/types.js";
import { randomUUID } from "crypto";

const BASE_URL = "https://www.willys.se";
const OFFERS_URL = `${BASE_URL}/erbjudanden/ehandel`;
// Axfood product API (used by Willys, Hemköp)
const API_URL = `${BASE_URL}/search/offer/c/erbjudanden?size=48&page=0&type=offer`;

interface WillysProduct {
  code?: string;
  name?: string;
  price?: { value?: number; formattedValue?: string };
  comparePrice?: string;
  image?: { url?: string };
  potentialPromotions?: Array<{
    price?: { value?: number };
    description?: string;
    endDate?: string;
  }>;
  categories?: Array<{ name?: string }>;
}

interface WillysApiResponse {
  results?: WillysProduct[];
  pagination?: { totalResults?: number };
}

async function fromApi(): Promise<Product[]> {
  const data = await fetchJson<WillysApiResponse>(API_URL, {
    Referer: OFFERS_URL,
  });

  if (!Array.isArray(data?.results)) throw new Error("Unexpected Willys API shape");

  return data.results
    .filter((p) => p.name && p.price?.value !== undefined)
    .map((p) => {
      const promo = p.potentialPromotions?.[0];
      const price = p.price!.value!;
      const originalPrice = promo?.price?.value && promo.price.value > price
        ? promo.price.value
        : undefined;

      return {
        id: randomUUID(),
        name: p.name!,
        price,
        originalPrice,
        unit: p.comparePrice ?? undefined,
        imageUrl: p.image?.url
          ? (p.image.url.startsWith("http") ? p.image.url : `${BASE_URL}${p.image.url}`)
          : undefined,
        store: "willys" as const,
        category: p.categories?.[0]?.name,
        offerEnds: promo?.endDate ?? undefined,
        discount: originalPrice
          ? Math.round((1 - price / originalPrice) * 100)
          : undefined,
        scrapedAt: Date.now(),
      };
    });
}

async function fromHtml(): Promise<Product[]> {
  const $ = await fetchHtml(OFFERS_URL);
  const products: Product[] = [];

  $("[class*='product'], [class*='offer'], article").each((_, el) => {
    const name = $(el).find("[class*='name'], [class*='title'], h2, h3").first().text().trim();
    const priceText = $(el)
      .find("[class*='price']:not([class*='original']):not([class*='compare'])")
      .first()
      .text()
      .trim();
    const imageUrl = $(el).find("img").first().attr("src") ??
      $(el).find("img").first().attr("data-src");

    if (!name) return;
    const price = parseSwedishPrice(priceText);
    if (price === null) return;

    products.push({
      id: randomUUID(),
      name,
      price,
      imageUrl: imageUrl ? resolveUrl(BASE_URL, imageUrl) : undefined,
      store: "willys",
      scrapedAt: Date.now(),
    });
  });

  return products;
}

export async function scrapeWillys(): Promise<Product[]> {
  try {
    const products = await fromApi();
    if (products.length > 0) {
      console.log(`[Willys] Fetched ${products.length} products via API`);
      return products;
    }
  } catch (err) {
    console.warn(`[Willys] API failed: ${String(err)}. Trying HTML...`);
  }

  try {
    const products = await fromHtml();
    console.log(`[Willys] Fetched ${products.length} products via HTML`);
    return products;
  } catch (err) {
    console.error(`[Willys] HTML scrape failed: ${String(err)}`);
    return [];
  }
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
  return new URL(url, base).href;
}
