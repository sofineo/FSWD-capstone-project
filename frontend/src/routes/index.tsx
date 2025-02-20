import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Counter } from "@/pages/Counter";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Counter />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
