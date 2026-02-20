import { useState, useMemo } from "react";
import type { Product, StoreId } from "@shared/types";
import { STORES } from "@shared/types";
import { useProducts } from "./hooks/useProducts";
import { useBasket } from "./hooks/useBasket";
import { Header } from "./components/Header";
import { StoreFilter } from "./components/StoreFilter";
import { ProductGrid } from "./components/ProductGrid";
import { PriceComparison } from "./components/PriceComparison";
import { BasketSidebar } from "./components/BasketSidebar";

type SortOption = "price_asc" | "price_desc" | "discount" | "name";

export default function App() {
  const { products, lastUpdated, loading, error, refresh } = useProducts();
  const { items, addItem, removeItem, updateQuantity, clearBasket, total, totalItems } =
    useBasket();

  // UI state
  const [activeStores, setActiveStores] = useState<Set<StoreId>>(
    new Set(Object.keys(STORES) as StoreId[])
  );
  const [sortBy, setSortBy] = useState<SortOption>("price_asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [comparingProduct, setComparingProduct] = useState<Product | null>(null);
  const [basketOpen, setBasketOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Toggle store filter
  const toggleStore = (store: StoreId) => {
    setActiveStores((prev) => {
      const next = new Set(prev);
      if (next.has(store)) {
        if (next.size === 1) return prev; // always keep at least one
        next.delete(store);
      } else {
        next.add(store);
      }
      return next;
    });
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Filter + sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => activeStores.has(p.store));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case "price_asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "discount":
        result = [...result].sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
        break;
      case "name":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name, "sv"));
        break;
    }

    return result;
  }, [products, activeStores, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        totalItems={totalItems}
        onOpenBasket={() => setBasketOpen(true)}
        onRefresh={handleRefresh}
        lastUpdated={lastUpdated}
        refreshing={refreshing || loading}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            <strong>Fel:</strong> {error}. Backend-servern kanske inte är igång (
            <code className="text-xs">npm run dev:server</code>).
          </div>
        )}

        {/* Filters row */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
          {/* Search */}
          <input
            type="search"
            placeholder="Sök produkter... (t.ex. mjölk, äpple)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />

          <div className="flex flex-wrap items-center gap-3 justify-between">
            {/* Store toggles */}
            <StoreFilter activeStores={activeStores} onToggle={toggleStore} />

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="price_asc">Pris: Lägst först</option>
              <option value="price_desc">Pris: Högst först</option>
              <option value="discount">Störst rabatt</option>
              <option value="name">Namn A–Ö</option>
            </select>
          </div>

          {/* Summary */}
          <p className="text-xs text-gray-400">
            Visar {filteredProducts.length} av {products.length} erbjudanden
          </p>
        </div>

        {/* Product grid */}
        <ProductGrid
          products={filteredProducts}
          onAddToBasket={addItem}
          onCompare={setComparingProduct}
          loading={loading}
        />
      </main>

      {/* Price comparison modal */}
      {comparingProduct && (
        <PriceComparison
          product={comparingProduct}
          onClose={() => setComparingProduct(null)}
          onAddToBasket={(p) => {
            addItem(p);
            setComparingProduct(null);
          }}
        />
      )}

      {/* Basket sidebar */}
      {basketOpen && (
        <BasketSidebar
          items={items}
          total={total}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onClear={clearBasket}
          onClose={() => setBasketOpen(false)}
        />
      )}
    </div>
  );
}
