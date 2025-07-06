import React, { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
fullname: "",
    email: "",
    password: "",
  });

useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await axios.get("/api/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
setUser(data.user);
setFormData({
fullname: data.user.fullname,
            email: data.user.email,
            password: "",
          });
          if (data.user.role === "admin") {
            const employeesData = await axios.get("/api/employees", {
              headers: { Authorization: `Bearer ${token}` },
            });
setEmployees(employeesData.data);
          }
        } catch (error) {
setMessage(error.response?.data?.message || "Failed to fetch user");
        }
      }
    };
fetchUser();
  }, []);

  const handleFileChange = (e) => {
setAvatar(e.target.files[0]);
  };

  const handleAvatarUpdate = async () => {
    if (!avatar) {
setMessage("Please select an avatar to upload");
      return;
    }
    const form = new FormData();
form.append("avatar", avatar);
    try {
      const { data } = await axios.put("/api/avatar", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
withCredentials: true,
      });
setUser(data.user);
setMessage("Avatar updated successfully");
    } catch (error) {
setMessage(error.response?.data?.message || "Failed to update avatar");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
withCredentials: true,
        }
      );
localStorage.removeItem("token");
setMessage("Logged out successfully");
setUser(null);
    } catch (error) {
setMessage(error.response?.data?.message || "Logout failed");
    }
  };

  const handleInputChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put("/api/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
setUser(data.user);
setMessage("Profile updated successfully");
    } catch (error) {
setMessage(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
<div className="profile-container">
<h2 className="profile-heading">Profile</h2>
      {user ? (
<div className="profile-content">
<div className="profile-avatar">
<img
  src={`./img1.jpg`}
  alt="Avatar"
  className="avatar-img"
/>

<p className="user-fullname">{user.fullname}</p>
<p className="user-username">@{user.username}</p>
</div>
<form onSubmit={handleProfileUpdate} className="profile-form">
<div className="form-group">
<strong>Email:</strong>
<input
                type="email"
                name="email"
                value={formData.email}
onChange={handleInputChange}
              />
</div>
<div className="form-group">
<strong>Full Name:</strong>
<input
                type="text"
                name="fullname"
                value={formData.fullname}
onChange={handleInputChange}
              />
</div>
<div className="form-group">
<strong>Password:</strong>
<input
                type="password"
                name="password"
                value={formData.password}
onChange={handleInputChange}
              />
</div>
<button type="submit" className="btn update-btn">
              Update Profile
</button>
</form>
<div className="avatar-upload">
<input type="file" onChange={handleFileChange} />
<button onClick={handleAvatarUpdate} className="btn upload-btn">
              Update Avatar
</button>
</div>
          {user.role === "admin" && (
<div className="employee-list">
<h3>All Employees</h3>
              {employees.length> 0 ? (
<table className="employee-table">
<thead>
<tr>
<th>Full Name</th>
<th>Username</th>
<th>Email</th>
</tr>
</thead>
<tbody>
                    {employees.map((employee) => (
<tr key={employee._id}>
<td>{employee.fullname}</td>
<td>{employee.username}</td>
<td>{employee.email}</td>
</tr>
                    ))}
</tbody>
</table>
              ) : (
<p>No employees found</p>
              )}
</div>
          )}
<button onClick={handleLogout} className="btn logout-btn">
            Logout
</button>
</div>
      ) : (
<p className="no-user-msg">No user logged in</p>
      )}
      {message &&<p className="error-msg">{message}</p>}
</div>
  );
};

export default Profile;
