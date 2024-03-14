import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/auth";
import Home from "../pages/Home";
import PrivateRoute from "./private-route";
import Users from "../pages/Users";
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
          path: "/chat/:id",
          element: <Home />,
        },
        {
          path: "/users",
          element: <Users />,
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
