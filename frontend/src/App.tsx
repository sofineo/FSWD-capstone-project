import { useState } from "react";
import Routes from "./routes";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  const [count, setCount] = useState(0);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes />
    </ThemeProvider>
  );
}

export default App;
