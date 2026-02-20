import { Trash2, X, Plus, Minus, ShoppingBag } from "lucide-react";
import type { BasketItem } from "@shared/types";
import { StoreBadge } from "./StoreBadge";

interface BasketSidebarProps {
  items: BasketItem[];
  total: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function BasketSidebar({
  items,
  total,
  onUpdateQuantity,
  onRemove,
  onClear,
  onClose,
}: BasketSidebarProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="relative z-10 bg-white w-full max-w-sm flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-green-600" />
            <h2 className="font-semibold text-gray-900">
              Min korg ({items.length} {items.length === 1 ? "vara" : "varor"})
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
              <span className="text-5xl mb-3">🛒</span>
              <p className="font-medium text-gray-500">Korgen är tom</p>
              <p className="text-sm mt-1">Lägg till varor från listan</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 p-4">
                  {/* Image */}
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-2xl">🛒</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                      {product.name}
                    </p>
                    <StoreBadge store={product.store} size="sm" />
                    <p className="text-xs text-gray-500 mt-0.5">
                      {product.price.toFixed(2).replace(".", ",")} kr / st
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
                      >
                        <Plus size={12} />
                      </button>
                      <span className="ml-auto text-sm font-bold text-gray-900">
                        {(product.price * quantity).toFixed(2).replace(".", ",")} kr
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemove(product.id)}
                    className="self-start p-1 rounded text-gray-300 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Totalt</span>
              <span className="text-xl font-bold text-gray-900">
                {total.toFixed(2).replace(".", ",")} kr
              </span>
            </div>
            <button
              onClick={onClear}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 border border-red-200 transition-colors"
            >
              <Trash2 size={15} />
              Töm korg
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
