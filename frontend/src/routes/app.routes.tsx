import { Routes, Route } from "react-router-dom";
import { Dashboard } from "@/app/Home/page";
import { ProtectedRoute } from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
