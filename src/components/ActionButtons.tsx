import type { PetAction } from "@/types";

const ACTIONS: { action: PetAction; label: string; emoji: string }[] = [
  { action: "feed", label: "Feed", emoji: "\uD83C\uDF55" },
  { action: "sleep", label: "Sleep", emoji: "\uD83D\uDCA4" },
  { action: "code", label: "Code", emoji: "\uD83D\uDCBB" },
  { action: "play", label: "Play", emoji: "\uD83C\uDFAE" },
  { action: "learn", label: "Learn", emoji: "\uD83D\uDCDA" },
];

interface ActionButtonsProps {
  onAction: (action: PetAction) => void;
}

export function ActionButtons({ onAction }: ActionButtonsProps) {
  return (
    <div className="action-buttons">
      {ACTIONS.map(({ action, label, emoji }) => (
        <button
          key={action}
          className="action-buttons__btn"
          onClick={() => onAction(action)}
        >
          <span className="action-buttons__emoji">{emoji}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
