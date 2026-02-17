import { usePet } from "@/hooks";
import { PetDisplay, HatchScreen } from "@/components";
import "./styles/App.css";

export default function App() {
  const { pet, hatchPet, performAction, isSleeping } = usePet();

  return (
    <main className="app">
      {pet ? (
        <PetDisplay pet={pet} onAction={performAction} isSleeping={isSleeping} />
      ) : (
        <HatchScreen onHatch={hatchPet} />
      )}
    </main>
  );
}
