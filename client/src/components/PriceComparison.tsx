import { useEffect, useState } from "react";
import { X, ShoppingCart, ExternalLink } from "lucide-react";
import type { Product } from "@shared/types";
import { STORES } from "@shared/types";
import { compareProduct } from "../hooks/useProducts";
import { StoreBadge } from "./StoreBadge";

interface PriceComparisonProps {
  product: Product;
  onClose: () => void;
  onAddToBasket: (product: Product) => void;
}

export function PriceComparison({ product, onClose, onAddToBasket }: PriceComparisonProps) {
  const [matches, setMatches] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    compareProduct(product.name)
      .then((m) => {
        // Always include the original product if not in matches
        const ids = new Set(m.map((p) => p.id));
        if (!ids.has(product.id)) {
          setMatches([product, ...m].sort((a, b) => a.price - b.price));
        } else {
          setMatches(m.sort((a, b) => a.price - b.price));
        }
      })
      .finally(() => setLoading(false));
  }, [product]);

  const cheapest = matches[0];

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">Prisjämförelse</p>
            <h2 className="font-semibold text-gray-900 line-clamp-2 leading-snug">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="ml-3 p-1 rounded-full hover:bg-gray-100 text-gray-400 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-16 w-full" />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p>Inga matchningar hittades i andra butiker.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {matches.map((p, idx) => {
                const isCheapest = p.id === cheapest?.id;
                return (
                  <li
                    key={p.id}
                    className={`flex items-center gap-3 p-4 ${
                      isCheapest ? "bg-green-50" : ""
                    }`}
                  >
                    {/* Rank */}
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isCheapest
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}>
                      {idx + 1}
                    </span>

                    {/* Image */}
                    <div className="w-10 h-10 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-xl">🛒</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <StoreBadge store={p.store} size="sm" />
                      <p className="font-bold text-gray-900 mt-0.5">
                        {p.price.toFixed(2).replace(".", ",")} kr
                        {isCheapest && (
                          <span className="ml-1.5 text-xs font-normal text-green-600">
                            billigast
                          </span>
                        )}
                      </p>
                      {p.unit && <p className="text-xs text-gray-400">{p.unit}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => onAddToBasket(p)}
                        className="p-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700"
                        title="Lägg till i korg"
                      >
                        <ShoppingCart size={14} />
                      </button>
                      {STORES[p.store].website && (
                        <a
                          href={STORES[p.store].website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
                          title="Gå till butik"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
