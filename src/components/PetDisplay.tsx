import type { Pet } from "@/types";
import { StatsBar } from "./StatsBar";
import { ActionButtons } from "./ActionButtons";
import type { PetAction } from "@/types";

const STAGE_ART: Record<Pet["stage"], string> = {
  egg: "\uD83E\uDD5A",
  junior: "\uD83D\uDC23",
  mid: "\uD83E\uDDD1\u200D\uD83D\uDCBB",
  senior: "\uD83E\uDDD9",
  lead: "\uD83E\uDDD1\u200D\uD83D\uDE80",
};

interface PetDisplayProps {
  pet: Pet;
  onAction: (action: PetAction) => void;
}

export function PetDisplay({ pet, onAction }: PetDisplayProps) {
  return (
    <div className="pet-display">
      <h2 className="pet-display__name">{pet.name}</h2>
      <div className="pet-display__avatar">{STAGE_ART[pet.stage]}</div>
      <p className="pet-display__stage">
        Stage: <strong>{pet.stage}</strong> &middot; XP: {pet.xp}
      </p>

      <div className="pet-display__stats">
        <StatsBar label="Hunger" value={pet.stats.hunger} color="#ff9800" />
        <StatsBar label="Energy" value={pet.stats.energy} color="#2196f3" />
        <StatsBar label="Happiness" value={pet.stats.happiness} color="#e91e63" />
        <StatsBar label="Skill" value={pet.stats.skill} color="#9c27b0" />
      </div>

      <ActionButtons onAction={onAction} />
    </div>
  );
}
