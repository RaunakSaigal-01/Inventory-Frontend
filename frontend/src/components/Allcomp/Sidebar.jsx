import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaClipboardList,
  FaTruck,
  FaBox,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
} from "react-icons/fa";
import "./Sidebar.css"; // import external css

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="sidebar-container">
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">Inventory Manager</h2>
        <ul className="sidebar-menu">
          <li>
            <Link to="/" className="sidebar-link">
              <FaHome />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/inventory" className="sidebar-link">
              <FaBox />
              <span>Inventory</span>
            </Link>
          </li>
          <li>
            <Link to="/suppliers" className="sidebar-link">
              <FaTruck />
              <span>Supplier</span>
            </Link>
          </li>
          <li>
            <Link to="/orders" className="sidebar-link">
              <FaClipboardList />
              <span>Order</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="sidebar-link">
              <FaUser />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/login" className="sidebar-link">
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          </li>
          <li>
            <Link to="/register" className="sidebar-link">
              <FaUserPlus />
              <span>Register</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
