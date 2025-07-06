import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import logining from "../assets/authimg.png";
import "./login.css";

const Login = ({ setIsLoggedIn, setUsername, setIsAdmin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
e.preventDefault();
    if (!formData.email || !formData.password) {
toast.error("Email and password are required!");
      return;
    }
    try {
      const { data } = await axios.post("/api/login", formData);
      const decodedToken = JSON.parse(atob(data.token.split(".")[1]));
setIsLoggedIn(true);
setUsername(decodedToken.username);
setIsAdmin(decodedToken.role === "admin");
localStorage.setItem("token", data.token);
toast.success("Login successful!");
      navigate("/");
    } catch (error) {
toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
<div className="login-wrapper">
<ToastContainer />
<motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
className="login-box"
>
<div className="login-image-section">
<img src={logining} alt="Login" className="login-image" />
</div>
<div className="login-form-section">
<h2 className="login-title">Welcome Back</h2>
<p className="login-subtitle">Log in to access your account</p>
<form onSubmit={handleSubmit} className="login-form">
<input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
onChange={handleChange}
            />
<input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
onChange={handleChange}
            />
<button type="submit" className="login-button">
              Login
</button>
</form>
</div>
</motion.div>
</div>
  );
};

export default Login;

