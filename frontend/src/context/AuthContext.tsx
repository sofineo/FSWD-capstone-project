//https://github.com/sofineo/Food-Explorer-Front-end-/blob/main/src/hooks/auth.jsx

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "@/services/api";
import { toast } from "sonner";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: string | null;
  token: string | null;
  signIn: (credentials: SignInData) => Promise<void>;
  signOut: () => void;
}

interface DecodedToken {
  exp: number;
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthProviderProps {
  children: ReactNode;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  function isTokenValid(token: string): boolean {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); //convert to seconds
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  async function signIn({ email, password }: SignInData) {
    try {
      const res = await api.post("/api/session", { email, password });
      const { user, token } = res.data;

      localStorage.setItem("@app:user", JSON.stringify(user.user_id));
      localStorage.setItem(
        "@app:imperialSystem",
        JSON.stringify(user.imperialSystem)
      );
      localStorage.setItem("@app:token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user.user_id);
      setToken(token);

      toast(`Welcome, ${user.name}!`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(
          error.response?.data?.message || "Login failed. Please try again."
        );
      } else {
        toast("An unexpected error occurred.");
      }
    }
  }

  async function signOut() {
    localStorage.removeItem("@app:user");
    localStorage.removeItem("@app:imperialSystem");
    localStorage.removeItem("@app:token");

    setUser(null);
    setToken(null);
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("@app:user");
    const storedToken = localStorage.getItem("@app:token");

    if (storedUser && storedToken) {
      if (isTokenValid(storedToken)) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } else {
        signOut();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
