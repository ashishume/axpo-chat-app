import useLocalStorage from "../../shared/Hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { Button } from "@mui/material";
const Navbar = () => {
  const { value, removeStoredValue } = useLocalStorage("auth");
  const navigate = useNavigate();
  /** logout the user */
  const logOut = () => {
    removeStoredValue("auth");
    navigate("/login");
  };
  return (
    <div className="navbar-container">
      <div className="logo-container">
        <img src="/logo.png" className="logo" />
      </div>
      <div className="user-details">
        {value.name} (Me)
      </div>
      <div className="auth-action-container">
        <Button className="logout-btn" onClick={logOut}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
