import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import App from "../App";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import PrivateRoute from "../components/PrivateRoute"; // Import your PrivateRoute

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: <AuthLayouts><RegisterPage /></AuthLayouts>
      },
      {
        path: "email",
        element: <AuthLayouts><CheckEmailPage /></AuthLayouts>
      },
      {
        path: "password",
        element: <AuthLayouts><CheckPasswordPage /></AuthLayouts>
      },
      {
        path: "forgot-password",
        element: <AuthLayouts><ForgotPasswordPage /></AuthLayouts>
      },
      {
        path: "reset-password/:token",
        element: <AuthLayouts><ResetPasswordPage /></AuthLayouts>
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: (
              <PrivateRoute>
                <MessagePage />
              </PrivateRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
