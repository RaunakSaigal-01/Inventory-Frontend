import React, { useEffect, useState } from "react";
import axios from "axios";
import AddInventory from "../components/inventory/AddInventory";
import InventoryTable from "../components/inventory/InventoryTable";
import { FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./inventory.css";

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("/api/inventory");
setInventory(response.data);
    } catch (error) {
console.error("Error fetching inventory:", error);
toast.error("Error fetching inventory");
    }
  };

  const handleToast = (message, type) => {
    if (type === "success") {
toast.success(message);
    } else {
toast.error(message);
    }
  };

  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const totalValue = inventory.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const filteredInventory = inventory.filter((item) =>
item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
<div className="inventory-container">
<ToastContainer />
<div className="inventory-header">
<h1 className="inventory-title">Inventory Management</h1>
<button onClick={() =>setShowForm(!showForm)} className="inventory-add-button">
<FaPlus className = "inventory-add-icon" />
          {showForm ? "Hide Form" : "Add Inventory"}
</button>
</div>
      {showForm&& (
<div className="inventory-form-wrapper">
<AddInventory fetchInventory={fetchInventory} handleToast={handleToast} />
</div>
      )}
<div className="inventory-search-wrapper">
<input
          type="text"
          placeholder="Search Inventory..."
          value={searchTerm}
onChange={(e) =>setSearchTerm(e.target.value)}
className="inventory-search-input"
        />
</div>
<div className="inventory-summary-grid">
<div className="inventory-summary-card">
<h2 className="summary-title">Total Items</h2>
<p className="summary-value blue">{totalItems}</p>
</div>
<div className="inventory-summary-card">
<h2 className="summary-title">Total Quantity</h2>
<p className="summary-value green">{totalQuantity}</p>
</div>
<div className="inventory-summary-card">
<h2 className="summary-title">Total Value</h2>
<p className="summary-value red">${totalValue.toFixed(2)}</p>
</div>
</div>
<InventoryTable inventory={filteredInventory} fetchInventory={fetchInventory} />
</div>
  );
};

export default InventoryManagement;

