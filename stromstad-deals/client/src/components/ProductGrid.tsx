import type { Product } from "@shared/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAddToBasket: (product: Product) => void;
  onCompare: (product: Product) => void;
  loading: boolean;
}

export function ProductGrid({ products, onAddToBasket, onCompare, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="skeleton aspect-square" />
            <div className="p-3 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-8 w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
        <span className="text-5xl mb-4">🔍</span>
        <p className="text-lg font-medium text-gray-500">Inga produkter hittades</p>
        <p className="text-sm mt-1">Prova att ändra filter eller uppdatera data</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToBasket={onAddToBasket}
          onCompare={onCompare}
        />
      ))}
    </div>
  );
}
