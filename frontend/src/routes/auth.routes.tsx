import { Routes, Route } from "react-router-dom";
import { SignUp } from "@/app/signUp/page";
import { SignIn } from "@/app/signIn/page";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<SignUp />} />
      <Route index path="/" element={<SignIn />} />
    </Routes>
  );
};

export default AuthRoutes;
