import { ShoppingBag, RefreshCw } from "lucide-react";

interface HeaderProps {
  totalItems: number;
  onOpenBasket: () => void;
  onRefresh: () => void;
  lastUpdated: number | null;
  refreshing: boolean;
}

export function Header({ totalItems, onOpenBasket, onRefresh, lastUpdated, refreshing }: HeaderProps) {
  const formattedTime = lastUpdated
    ? new Intl.DateTimeFormat("sv-SE", { hour: "2-digit", minute: "2-digit" }).format(
        new Date(lastUpdated)
      )
    : null;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛍️</span>
          <div>
            <h1 className="text-lg font-bold leading-none text-gray-900">Strömstad Deals</h1>
            <p className="text-xs text-gray-400 leading-none mt-0.5">
              Bästa priser i din stad
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {formattedTime && (
            <span className="hidden sm:block text-xs text-gray-400">
              Uppdaterad {formattedTime}
            </span>
          )}

          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Hämta ny data från butikerna"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Uppdatera</span>
          </button>

          <button
            onClick={onOpenBasket}
            className="relative flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
          >
            <ShoppingBag size={16} />
            Korg
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
