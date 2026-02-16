/** Core stats for a DevGotchi pet, each ranging 0–100. */
export interface PetStats {
  hunger: number;
  energy: number;
  happiness: number;
  skill: number;
}

/** Possible lifecycle stages. */
export type PetStage = "egg" | "junior" | "mid" | "senior" | "lead";

/** Actions the player can perform. */
export type PetAction = "feed" | "sleep" | "code" | "play" | "learn";

/** Serialisable state of a single DevGotchi. */
export interface Pet {
  id: string;
  name: string;
  stage: PetStage;
  stats: PetStats;
  xp: number;
  createdAt: number;
  lastInteraction: number;
}
