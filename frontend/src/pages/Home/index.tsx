import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Counter = () => {
  const { signOut } = useAuth();

  function handleButtonSignOut() {
    signOut();
  }
  return (
    <>
      <ModeToggle />
      <Button onClick={handleButtonSignOut}>Sign Out</Button>
    </>
  );
};
