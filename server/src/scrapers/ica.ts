/**
 * ICA Kvantum Strömstad scraper
 * Store ID: 1003740
 *
 * Tries the public ICA Handla API first, then falls back to HTML scraping.
 * API docs (unofficial): https://handla.api.ica.se/api/offer/store?storeid={id}
 */

import { fetchJson, fetchHtml } from "../utils/http.js";
import type { Product } from "../../../shared/types.js";
import { randomUUID } from "crypto";

const STORE_ID = 1003740;
const API_URL = `https://handla.api.ica.se/api/offer/store?storeid=${STORE_ID}`;
const OFFERS_URL = `https://www.ica.se/butiker/kvantum/stromstad/ica-kvantum-stromstad-${STORE_ID}/erbjudanden/`;

interface IcaApiOffer {
  Product: string;
  OfferPrice: number;
  OriginalPrice?: number;
  ImageUrl?: string;
  PriceComparison?: string;
  SizeOrQuantityStr?: string;
  ArticleGroupId?: string;
  OfferId?: string;
}

interface IcaApiResponse {
  Offers: IcaApiOffer[];
}

/** Attempt to fetch offers from the ICA JSON API. */
async function fromApi(): Promise<Product[]> {
  const data = await fetchJson<IcaApiResponse>(API_URL, {
    "X-Requested-With": "XMLHttpRequest",
  });

  if (!Array.isArray(data?.Offers)) throw new Error("Unexpected ICA API shape");

  return data.Offers.map((offer) => {
    const price = offer.OfferPrice ?? 0;
    const originalPrice = offer.OriginalPrice && offer.OriginalPrice > price
      ? offer.OriginalPrice
      : undefined;

    return {
      id: randomUUID(),
      name: offer.Product ?? "Okänd produkt",
      price,
      originalPrice,
      unit: offer.SizeOrQuantityStr ?? offer.PriceComparison ?? undefined,
      imageUrl: offer.ImageUrl ?? undefined,
      store: "ica" as const,
      discount: originalPrice
        ? Math.round((1 - price / originalPrice) * 100)
        : undefined,
      scrapedAt: Date.now(),
    };
  });
}

/** Fallback: scrape the store's HTML offers page. */
async function fromHtml(): Promise<Product[]> {
  const $ = await fetchHtml(OFFERS_URL);
  const products: Product[] = [];

  // ICA renders offer tiles with class "offer-card" or similar
  $("[class*='offer'], [class*='product-card'], article").each((_, el) => {
    const name = $(el).find("[class*='title'], [class*='name'], h2, h3").first().text().trim();
    const priceText = $(el).find("[class*='price']").first().text().trim();
    const imageUrl = $(el).find("img").first().attr("src");

    if (!name) return;

    const price = parseSwedishPrice(priceText);
    if (price === null) return;

    products.push({
      id: randomUUID(),
      name,
      price,
      imageUrl: imageUrl ? resolveUrl(OFFERS_URL, imageUrl) : undefined,
      store: "ica",
      scrapedAt: Date.now(),
    });
  });

  return products;
}

export async function scrapeIca(): Promise<Product[]> {
  try {
    const products = await fromApi();
    if (products.length > 0) {
      console.log(`[ICA] Fetched ${products.length} products via API`);
      return products;
    }
  } catch (err) {
    console.warn(`[ICA] API failed: ${String(err)}. Trying HTML...`);
  }

  try {
    const products = await fromHtml();
    console.log(`[ICA] Fetched ${products.length} products via HTML`);
    return products;
  } catch (err) {
    console.error(`[ICA] HTML scrape failed: ${String(err)}`);
    return [];
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseSwedishPrice(text: string): number | null {
  if (!text) return null;
  // Handle "12,90", "12.90", "12:90", "12 kr" etc.
  const cleaned = text.replace(/[^\d,.:]/g, "").replace(",", ".").replace(":", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function resolveUrl(base: string, url: string): string {
  if (url.startsWith("http")) return url;
  return new URL(url, base).href;
}
