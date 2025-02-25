import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import Routes from "./routes";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Toaster />
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
