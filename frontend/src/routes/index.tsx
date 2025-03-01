import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

const Routes = () => {
  const { token } = useAuth();

  let decoded = token ? jwtDecode(token) : null;
  console.log(decoded);

  return token ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
