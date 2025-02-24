import { Routes, Route } from "react-router-dom";
import { SignUp } from "@/pages/SignUp";
import { SignIn } from "@/pages/SignIn";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<SignUp />} />
      <Route index path="/" element={<SignIn />} />
    </Routes>
  );
};

export default AuthRoutes;
