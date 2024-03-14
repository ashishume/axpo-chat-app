import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { useEffect, useState } from "react";
import InputField from "../components/InputField";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import useLocalStorage from "../../shared/Hooks/useLocalStorage";
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const authFormData = [
    {
      id: 1,
      name: "name",
      label: "Enter name",
      value: formData.name,
    },
    {
      id: 2,
      name: "email",
      label: "Enter email",
      value: formData.email,
    },
    {
      id: 3,
      name: "password",
      label: "Enter password",
      value: formData.password,
    },
  ];

  const [isLogin, setIsLogin] = useState(null as any);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { value ,setStoredValue} = useLocalStorage("auth");
  useEffect(() => {
    const isLoginPath = pathname.split("/").includes("login");
    setIsLogin(isLoginPath);
    if (value) {
      navigate("/home");
    }
  }, []);
  function handleSubmit(e: any) {
    e.preventDefault();
    const url = `${import.meta.env.VITE_BASE_URL}/${
      isLogin ? "login" : "signup"
    }`;
    axios
      .post(url, formData)
      .then((res) => {
        if (res.status === 200) {
          setStoredValue(res.data.user);
          navigate("/home");
        }
      })
      .catch((e) => {
        console.log(e);
        
        console.error("Authentication failed");
      });
  }

  function handleChange(e: any) {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {isLogin ? "Login" : "Signup"}
        </Typography>
        <Box sx={{ mt: 3 }}>
          <form noValidate onSubmit={handleSubmit}>
            {authFormData.map(({ id, name, label, value }) => {
              if (isLogin && name !== "name") {
                return (
                  <InputField
                    key={id}
                    value={value}
                    name={name}
                    label={label}
                    handleChange={handleChange}
                  />
                );
              }
              if (!isLogin) {
                return (
                  <InputField
                    key={id}
                    value={value}
                    name={name}
                    label={label}
                    handleChange={handleChange}
                  />
                );
              }
            })}

            <Box sx={{ mt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
