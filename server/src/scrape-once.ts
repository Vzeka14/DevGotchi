/** One-shot script: npm run scrape — useful for testing scrapers locally */
import { scrapeAll } from "./scrapers/index.js";

const products = await scrapeAll();
console.log(`\nTotal: ${products.length} products`);

const byStore = products.reduce<Record<string, number>>((acc, p) => {
  acc[p.store] = (acc[p.store] ?? 0) + 1;
  return acc;
}, {});

for (const [store, count] of Object.entries(byStore)) {
  console.log(`  ${store}: ${count}`);
}

process.exit(0);
