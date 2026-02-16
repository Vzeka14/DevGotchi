import type { Pet, PetAction, PetStats } from "@/types";

const STAT_DECAY_RATE = 2;
const XP_PER_ACTION = 10;
const STAGE_THRESHOLDS: Record<number, Pet["stage"]> = {
  0: "egg",
  50: "junior",
  200: "mid",
  500: "senior",
  1000: "lead",
};

/** Apply stat decay based on elapsed time (in seconds). */
export function decayStats(stats: PetStats, elapsedSeconds: number): PetStats {
  const ticks = Math.floor(elapsedSeconds / 60);
  return {
    hunger: Math.max(0, stats.hunger - ticks * STAT_DECAY_RATE),
    energy: Math.max(0, stats.energy - ticks * STAT_DECAY_RATE),
    happiness: Math.max(0, stats.happiness - ticks * STAT_DECAY_RATE),
    skill: stats.skill,
  };
}

/** Return the stage for a given XP total. */
export function stageForXp(xp: number): Pet["stage"] {
  let result: Pet["stage"] = "egg";
  for (const [threshold, stage] of Object.entries(STAGE_THRESHOLDS)) {
    if (xp >= Number(threshold)) result = stage;
  }
  return result;
}

const ACTION_EFFECTS: Record<PetAction, Partial<PetStats>> = {
  feed: { hunger: 20 },
  sleep: { energy: 25 },
  code: { skill: 5, energy: -10 },
  play: { happiness: 20, energy: -5 },
  learn: { skill: 10, energy: -15, happiness: -5 },
};

/** Apply an action to a pet, returning the updated pet. */
export function applyAction(pet: Pet, action: PetAction): Pet {
  const effects = ACTION_EFFECTS[action];
  const stats: PetStats = { ...pet.stats };

  for (const [key, delta] of Object.entries(effects)) {
    const k = key as keyof PetStats;
    stats[k] = Math.min(100, Math.max(0, stats[k] + (delta as number)));
  }

  const xp = pet.xp + XP_PER_ACTION;
  return {
    ...pet,
    stats,
    xp,
    stage: stageForXp(xp),
    lastInteraction: Date.now(),
  };
}

/** Clamp a stat value to 0–100. */
export function clampStat(value: number): number {
  return Math.min(100, Math.max(0, value));
}
