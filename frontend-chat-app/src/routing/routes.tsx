import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/auth";
import Home from "../pages/Home";
import PrivateRoute from "./private-route";
const Router = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <PrivateRoute />,
      children: [
        // {
        //   path: "/",
        //   element: <App />,
        // },
        {
          path: "/home",
          element: <Home />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
      errorElement: "",
    },
    {
      path: "/signup",
      element: <LoginPage />,
      errorElement: "",
    },
  ]);

  return <RouterProvider router={routes} />;
};

export default Router;
