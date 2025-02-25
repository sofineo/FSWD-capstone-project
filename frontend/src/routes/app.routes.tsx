import { Routes, Route } from "react-router-dom";
import { Counter } from "@/pages/Home";

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/" element={<Counter />} />
      </Routes>
  );
};

export default AppRoutes;
