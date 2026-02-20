import type { StoreId } from "@shared/types";
import { STORES } from "@shared/types";

interface StoreBadgeProps {
  store: StoreId;
  size?: "sm" | "md";
}

export function StoreBadge({ store, size = "md" }: StoreBadgeProps) {
  const info = STORES[store];
  const cls = size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-xs font-semibold";
  return (
    <span
      className={`inline-block rounded-full text-white ${cls} store-badge-${store}`}
      style={{ background: info.color, color: store === "willys" ? "#1a1a1a" : "white" }}
    >
      {info.name}
    </span>
  );
}
