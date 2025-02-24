import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app.routes";
import AuthRoutes from "./auth.routes";

const Routes = () => {
  const token = false;
  // return (
  //   <BrowserRouter>
  //   {token ? <AppRoutes /> : <AuthRoutes />}
  //   </BrowserRouter>
  // );

  return token ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
