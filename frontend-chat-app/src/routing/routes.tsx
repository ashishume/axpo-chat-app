import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import App from "../App";
import LoginPage from "../pages/auth";
import Chat from "../pages/Chat";
import PrivateRoute from "./private-route";
import Users from "../pages/Users";
import Home from "../pages/Home";
const Router = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <PrivateRoute />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        // {
        //   path: "/chat",
        //   element: <Chat />,
        // },
        // {
        //   path: "/users",
        //   element: <Users />,
        // },
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
