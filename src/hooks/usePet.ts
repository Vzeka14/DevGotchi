import { useState, useCallback, useEffect } from "react";
import type { Pet, PetAction } from "@/types";
import { applyAction, decayStats } from "@/utils/petEngine";
import { savePet, loadPet } from "@/utils/storage";

function createDefaultPet(name: string): Pet {
  return {
    id: crypto.randomUUID(),
    name,
    stage: "egg",
    stats: { hunger: 80, energy: 80, happiness: 80, skill: 0 },
    xp: 0,
    createdAt: Date.now(),
    lastInteraction: Date.now(),
  };
}

export function usePet() {
  const [pet, setPet] = useState<Pet | null>(() => {
    const saved = loadPet();
    if (!saved) return null;
    const elapsed = (Date.now() - saved.lastInteraction) / 1000;
    return { ...saved, stats: decayStats(saved.stats, elapsed) };
  });

  useEffect(() => {
    if (pet) savePet(pet);
  }, [pet]);

  useEffect(() => {
    if (!pet) return;
    const interval = setInterval(() => {
      setPet((prev) => {
        if (!prev) return prev;
        return { ...prev, stats: decayStats(prev.stats, 60) };
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, [pet]);

  const hatchPet = useCallback((name: string) => {
    setPet(createDefaultPet(name));
  }, []);

  const performAction = useCallback((action: PetAction) => {
    setPet((prev) => (prev ? applyAction(prev, action) : prev));
  }, []);

  return { pet, hatchPet, performAction };
}
