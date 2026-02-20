import type { StoreId } from "@shared/types";
import { STORES } from "@shared/types";

interface StoreFilterProps {
  activeStores: Set<StoreId>;
  onToggle: (store: StoreId) => void;
}

const ALL_STORES = Object.values(STORES);

export function StoreFilter({ activeStores, onToggle }: StoreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_STORES.map((store) => {
        const active = activeStores.has(store.id);
        return (
          <button
            key={store.id}
            onClick={() => onToggle(store.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
              active
                ? "text-white border-transparent shadow-sm"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
            style={active ? { background: store.color, borderColor: store.color } : {}}
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: store.color }}
            />
            {store.name}
          </button>
        );
      })}
    </div>
  );
}
