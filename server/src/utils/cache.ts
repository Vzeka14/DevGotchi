import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { Product, StoreId } from "../../../shared/types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.resolve(__dirname, "../../cache");
const CACHE_FILE = path.join(CACHE_DIR, "products.json");

interface CacheData {
  products: Product[];
  lastUpdated: number;
  storesUpdated: StoreId[];
}

function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

export function readCache(): CacheData | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = fs.readFileSync(CACHE_FILE, "utf-8");
    return JSON.parse(raw) as CacheData;
  } catch {
    return null;
  }
}

export function writeCache(data: CacheData): void {
  ensureCacheDir();
  fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function isCacheStale(maxAgeMs = 12 * 60 * 60 * 1000): boolean {
  const cache = readCache();
  if (!cache) return true;
  return Date.now() - cache.lastUpdated > maxAgeMs;
}
