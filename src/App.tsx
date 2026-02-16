import { usePet } from "@/hooks";
import { PetDisplay, HatchScreen } from "@/components";
import "./styles/App.css";

export default function App() {
  const { pet, hatchPet, performAction } = usePet();

  return (
    <main className="app">
      {pet ? (
        <PetDisplay pet={pet} onAction={performAction} />
      ) : (
        <HatchScreen onHatch={hatchPet} />
      )}
    </main>
  );
}
