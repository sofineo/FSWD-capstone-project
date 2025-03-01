import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";
import { useAuth } from "@/context/AuthContext";

const Routes = () => {
  const { token } = useAuth();

  return token ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
