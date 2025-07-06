import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InventorySummaryCard from "../components/Dashboard/InventorySummaryCard.jsx";
import OrderSummaryCard from "../components/Dashboard/OrderSummaryCard.jsx";
import RevenueSummaryCard from "../components/Dashboard/RevenueSummaryCard.jsx";
import TopSellingProductsSummaryCard from "../components/Dashboard/TopSellingProductsSummaryCard.jsx";
import InventoryChart from "../components/Dashboard/InventoryChart.jsx";
import TopSellingProductsChart from "../components/Dashboard/TopSellingProductsChart.jsx";
import TopInventoryItems from "../components/Dashboard/TopInventoryItems.jsx";
import TopSuppliersSummaryCard from "../components/Dashboard/TopSuppliersSummaryCard.jsx";
import RevenueByCategoryChart from "../components/Dashboard/RevenueByCategoryChart.jsx";
import SalesOverTimeChart from "../components/Dashboard/SalesOverTimeChart.jsx";
import LowStockItems from "../components/Dashboard/LowStockItems.jsx";
import "./dashboard.css";

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

useEffect(() => {
fetchInventory();
fetchOrders();
fetchSuppliers();
fetchLowStockItems();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("/api/inventory");
setInventory(response.data);
    } catch (error) {
console.error("Error fetching inventory:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders");
setOrders(response.data);
    } catch (error) {
console.error("Error fetching orders:", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("/api/suppliers");
setSuppliers(response.data);
    } catch (error) {
console.error("Error fetching suppliers:", error);
    }
  };

  const fetchLowStockItems = async () => {
    try {
      const response = await axios.get("/api/inventory/low-stock", {
        headers: "Authorization: Bearer " + localStorage.getItem("token"),
      });
setLowStockItems(response.data);
    } catch (error) {
console.error("Error fetching low stock items:", error);
    }
  };

  return (
<div className="dashboard-container">
<h1 className="dashboard-heading">Dashboard</h1>
<div className="card-grid">
<InventorySummaryCard inventory={inventory} />
<OrderSummaryCard orders={orders} />
<RevenueSummaryCard orders={orders} />
<TopSellingProductsSummaryCard orders={orders} />
</div>
<div className="chart-grid">
<InventoryChart inventory={inventory} />
<TopSellingProductsChart orders={orders} />
</div>
<div className="chart-grid">
<RevenueByCategoryChart orders={orders} />
<SalesOverTimeChart orders={orders} />
</div>
<div className="info-grid">
<TopInventoryItems inventory={inventory} />
<TopSuppliersSummaryCard suppliers={suppliers} />
</div>
<div className="info-grid">
<LowStockItems lowStockItems={lowStockItems} />
</div>
<ToastContainer />
</div>
  );
};

export default Dashboard;
