import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "@/context/AuthContext"; 

interface ImperialSystemContextType {
  imperialSystem: boolean;
  toggleImperialSystem: () => void;
  setImperialSystem: (value: boolean) => void;
}

const ImperialSystemContext = createContext<
  ImperialSystemContextType | undefined
>(undefined);

export function ImperialSystemProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); 
  const [imperialSystem, setImperialSystem] = useState(false);

  useEffect(() => {
    if (user) {
      const storedPreference = localStorage.getItem("@app:imperialSystem");
      setImperialSystem(storedPreference === "true");
    }
  }, [user]);

  const toggleImperialSystem = () => {
    setImperialSystem((prev) => !prev);
    localStorage.setItem("@app:imperialSystem", (!imperialSystem).toString());
  };

  return (
    <ImperialSystemContext.Provider
      value={{ imperialSystem, toggleImperialSystem, setImperialSystem }}
    >
      {children}
    </ImperialSystemContext.Provider>
  );
}

export function useImperialSystem() {
  const context = useContext(ImperialSystemContext);
  if (!context) {
    throw new Error(
      "useImperialSystem must be used within an ImperialSystemProvider"
    );
  }
  return context;
}
