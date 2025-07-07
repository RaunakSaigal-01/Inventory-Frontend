import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Registerimg from "../assets/warehouses.avif";
import "./register.css";

const Register = () => {
  const [formData, setFormData] = useState({
fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
e.preventDefault();
    if (!formData.fullname || !formData.username || !formData.email || !formData.password) {
toast.error("All fields are required!");
      return;
    }
    const form = new FormData();
form.append("fullname", formData.fullname);
form.append("username", formData.username);
form.append("email", formData.email);
form.append("password", formData.password);
    if (avatar) form.append("avatar", avatar);

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users`, formData, {
  headers: {
    "Content-Type": "multipart/form-data"
  }
});
toast.success(data.message);
setIsOtpSent(true);
    } catch (error) {
toast.error(error.response?.data?.message || "Error occurred during registration");
    }
  };

  const handleOtpSubmit = async (e) => {
e.preventDefault();
    try {
      const { data } = await axios.post("/api/verify-otp", {
        email: formData.email,
otp,
      });
toast.success(data.message);
      navigate("/login");
    } catch (error) {
toast.error(error.response?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
<div className="register-wrapper">
<ToastContainer />
<motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
className="register-box"
>
<div className="register-image-section">
<img src={Registerimg} alt="Register" className="register-image" />
</div>
<div className="register-form-section">
<h2 className="register-title">Join Us</h2>
<p className="register-subtitle">Create an account and get started!</p>
          {!isOtpSent ? (
<form onSubmit={handleSubmit} className="register-form">
<input type="text" name="fullname" placeholder="Full Name" value={formData.fullname} onChange={handleChange} />
<input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
<input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
<input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
<input type="file" onChange={handleFileChange} />
<button type="submit" className="register-btn blue">Register</button>
</form>
          ) : (
<form onSubmit={handleOtpSubmit} className="register-form">
<input type="text" name="otp" placeholder="Enter OTP" value={otp} onChange={(e) =>setOtp(e.target.value)} />
<button type="submit" className="register-btn green">Verify OTP</button>
</form>
          )}
</div>
</motion.div>
</div>
  );
};

export default Register;
