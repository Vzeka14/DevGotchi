import { useState, useEffect, useCallback } from "react";
import type { Product, StoreId } from "@shared/types";

interface ProductsState {
  products: Product[];
  lastUpdated: number | null;
  storesUpdated: StoreId[];
  loading: boolean;
  error: string | null;
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>({
    products: [],
    lastUpdated: null,
    storesUpdated: [],
    loading: true,
    error: null,
  });

  const fetchProducts = useCallback(async (forceRefresh = false) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const url = forceRefresh ? "/api/products?refresh=true" : "/api/products";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json() as {
        products: Product[];
        lastUpdated: number;
        storesUpdated: StoreId[];
      };
      setState({
        products: data.products,
        lastUpdated: data.lastUpdated,
        storesUpdated: data.storesUpdated,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { ...state, refresh: () => fetchProducts(true) };
}

/** Find the same product at other stores by name similarity */
export async function compareProduct(name: string): Promise<Product[]> {
  const res = await fetch(`/api/products/compare?name=${encodeURIComponent(name)}`);
  if (!res.ok) return [];
  const data = await res.json() as { matches: Product[] };
  return data.matches;
}
