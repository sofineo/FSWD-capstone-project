// import { useState } from "react";
import { Toaster } from "./components/ui/sonner";
import Routes from "./routes";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Toaster />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
