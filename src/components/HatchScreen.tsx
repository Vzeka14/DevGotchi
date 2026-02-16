import { useState } from "react";

interface HatchScreenProps {
  onHatch: (name: string) => void;
}

export function HatchScreen({ onHatch }: HatchScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onHatch(trimmed);
  };

  return (
    <div className="hatch-screen">
      <h1>DevGotchi</h1>
      <p>Name your developer pet and start the adventure!</p>
      <form onSubmit={handleSubmit} className="hatch-screen__form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name..."
          maxLength={20}
          autoFocus
        />
        <button type="submit" disabled={!name.trim()}>
          Hatch!
        </button>
      </form>
    </div>
  );
}
