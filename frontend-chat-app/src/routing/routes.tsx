import { RouterProvider, createBrowserRouter, useRouteError } from "react-router-dom";
import App from "../App";
import LoginPage from "../pages/auth";
const Router = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <App />,
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
    // {
    //   path: "*",
    //   element: <PageNotFound />,
    // },
  ]);

  return <RouterProvider router={routes} />;
};

export default Router;
