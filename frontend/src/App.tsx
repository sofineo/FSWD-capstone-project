import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { ImperialSystemProvider } from "./context/imperialSystemContext";
import Routes from "./routes";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <ImperialSystemProvider>
          <Toaster />
          <Routes />
        </ImperialSystemProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
