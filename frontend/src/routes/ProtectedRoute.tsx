import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
// import { jwtDecode } from "jwt-decode";

export function ProtectedRoute() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // let decoded = token ? jwtDecode(token) : null;
  // console.log(decoded);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  });
  return <>{token ? <Outlet /> : null}</>;
}
