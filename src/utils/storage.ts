import type { Pet } from "@/types";

const STORAGE_KEY = "devgotchi_save";

/** Persist pet state to localStorage. */
export function savePet(pet: Pet): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
}

/** Load pet state from localStorage, or return null. */
export function loadPet(): Pet | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Pet;
  } catch {
    return null;
  }
}

/** Remove saved pet state. */
export function clearSave(): void {
  localStorage.removeItem(STORAGE_KEY);
}
