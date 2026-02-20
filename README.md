# Strömstad Deals 🛍️

> Samla de bästa erbjudandena från Strömstads matbutiker på ett ställe.

A price aggregator that scrapes weekly deals from:

| Store | Website |
|-------|---------|
| ICA Kvantum Strömstad | ica.se |
| Willys | willys.se |
| Maxi Mat Nordby | maximatnordby.se |
| Eurocash Strömstad | eurocash.se |

## Features

- 🔍 **Search** products across all stores
- 🏷️ **Filter** by store
- 📊 **Compare prices** — click any product to see its price at other stores
- 🛒 **Basket** — build your shopping list with a running total
- ⚡ **Auto-refresh** — data is re-scraped every 3 hours and cached

## Project Structure

```
stromstad-deals/
├── shared/         # TypeScript types shared by client and server
├── server/         # Express API + scrapers (Node.js)
│   └── src/
│       ├── scrapers/   # ICA, Willys, MaxiNordby, Eurocash
│       ├── routes/     # REST API endpoints
│       └── utils/      # HTTP helpers, JSON cache
└── client/         # React + Vite + Tailwind frontend
    └── src/
        ├── components/ # UI components
        └── hooks/      # useProducts, useBasket
```

## Getting Started

```bash
# 1. Install all dependencies
npm install

# 2. Start both server and client
npm run dev
```

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both server and client |
| `npm run dev:server` | Start only the backend |
| `npm run dev:client` | Start only the frontend |
| `npm run scrape` | Run a one-shot scrape (test scrapers) |

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/products` | All products (scrapes if stale) |
| `GET /api/products?refresh=true` | Force re-scrape |
| `GET /api/products/compare?name=mjölk` | Find a product across stores |
| `POST /api/products/refresh` | Trigger manual scrape |
| `GET /api/health` | Server health check |

## Notes on Scraping

Scrapers use `cheerio` + `axios` for static HTML and fall back gracefully
if a store updates their layout. The cache lives in `server/cache/products.json`
and is refreshed every 3 hours via a cron job.

If a site requires JavaScript rendering, switch that scraper to use `playwright`
(already listed as a dependency).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Express, TypeScript, tsx |
| Scraping | Cheerio, Axios, Playwright (optional) |
| Scheduling | node-cron |
| Cache | JSON file (server/cache/) |
