interface StatsBarProps {
  label: string;
  value: number;
  color?: string;
}

export function StatsBar({ label, value, color = "#4caf50" }: StatsBarProps) {
  return (
    <div className="stats-bar">
      <span className="stats-bar__label">{label}</span>
      <div className="stats-bar__track">
        <div
          className="stats-bar__fill"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="stats-bar__value">{Math.round(value)}</span>
    </div>
  );
}
