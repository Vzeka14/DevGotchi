/** Supported store identifiers */
export type StoreId = "ica" | "willys" | "maxiNordby" | "eurocash";

/** Metadata for each store */
export interface StoreInfo {
  id: StoreId;
  name: string;
  color: string;
  website: string;
  logo?: string;
}

export const STORES: Record<StoreId, StoreInfo> = {
  ica: {
    id: "ica",
    name: "ICA Kvantum",
    color: "#E02222",
    website: "https://www.ica.se/butiker/kvantum/stromstad/ica-kvantum-stromstad-1003740/",
  },
  willys: {
    id: "willys",
    name: "Willys",
    color: "#FFC72C",
    website: "https://www.willys.se/erbjudanden/ehandel",
  },
  maxiNordby: {
    id: "maxiNordby",
    name: "Maxi Mat Nordby",
    color: "#0058A3",
    website: "https://www.maximatnordby.se/",
  },
  eurocash: {
    id: "eurocash",
    name: "Eurocash",
    color: "#006F3C",
    website: "https://www.eurocash.se/butiker/stromstad/",
  },
};

/** A single product offer from a store */
export interface Product {
  id: string;
  name: string;
  price: number;
  unit?: string;
  originalPrice?: number;
  imageUrl?: string;
  store: StoreId;
  category?: string;
  offerEnds?: string;
  discount?: number;
  productUrl?: string;
  scrapedAt: number;
}

/** API response for the products endpoint */
export interface ProductsResponse {
  products: Product[];
  lastUpdated: number;
  storesUpdated: StoreId[];
}

/** Basket item */
export interface BasketItem {
  product: Product;
  quantity: number;
}
