import { ShoppingCart, ArrowLeftRight } from "lucide-react";
import type { Product } from "@shared/types";
import { StoreBadge } from "./StoreBadge";

interface ProductCardProps {
  product: Product;
  onAddToBasket: (product: Product) => void;
  onCompare: (product: Product) => void;
}

export function ProductCard({ product, onAddToBasket, onCompare }: ProductCardProps) {
  const hasDiscount = product.originalPrice !== undefined && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice!) * 100)
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden border border-gray-100">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="text-5xl select-none">🛒</div>
        )}
        {discountPct && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPct}%
          </span>
        )}
        <div className="absolute top-2 left-2">
          <StoreBadge store={product.store} size="sm" />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-gray-800">
          {product.name}
        </h3>

        {product.unit && (
          <p className="text-xs text-gray-400">{product.unit}</p>
        )}

        <div className="mt-auto">
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-bold text-gray-900">
              {product.price.toFixed(2).replace(".", ",")} kr
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.originalPrice.toFixed(2).replace(".", ",")} kr
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onAddToBasket(product)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
            >
              <ShoppingCart size={14} />
              Lägg till
            </button>
            <button
              onClick={() => onCompare(product)}
              title="Jämför priser i andra butiker"
              className="flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs py-2 px-3 rounded-xl transition-colors"
            >
              <ArrowLeftRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
