import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import useLocalStorage from "../shared/Hooks/useLocalStorage";

const PrivateRoute = () => {
  const [isAuthenticated, setAuth] = useState(null);
  const { value } = useLocalStorage("auth");
  useEffect(() => {
    setAuth(value);
  }, []);
  if (isAuthenticated === null) {
    // Render a loading indicator or handle the situation accordingly
    return <span>Loading...</span>;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoute;
