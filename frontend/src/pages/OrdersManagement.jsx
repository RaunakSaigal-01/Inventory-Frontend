import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewOrder from "../components/orders/NewOrder";
import Pagination from "../components/orders/Pagination";
import OrderModal from "../components/orders/OrderModal";
import {
  TotalRevenueCard,
  TotalOrdersCard,
  AverageOrderValueCard,
  TotalQuantityCard,
  AverageQuantityPerOrderCard,
  MostCommonCategoryCard,
} from "../components/orders/OrderSummaryCard";
import "./orders.css";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/orders");
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleOrderAdded = (newOrder) => {
    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setShowForm(false);
    toast.success("Order added successfully!");
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const filteredOrders = orders.filter((order) =>
    order.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1 className="heading">Orders Management</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="toggle-button"
      >
        {showForm ? "Hide Form" : "Add Order"}
      </button>
      {showForm && <NewOrder onOrderAdded={handleOrderAdded} />}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search Orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="summary-grid">
        <TotalRevenueCard orders={orders} />
        <TotalOrdersCard orders={orders} />
        <AverageOrderValueCard orders={orders} />
        <TotalQuantityCard orders={orders} />
        <AverageQuantityPerOrderCard orders={orders} />
        <MostCommonCategoryCard orders={orders} />
      </div>
      <div className="orders-grid">
        {filteredOrders
          .slice(indexOfFirstOrder, indexOfLastOrder)
          .map((order) => (
            <div
              key={order._id}
              className="order-card"
              onClick={() => handleOrderClick(order)}
            >
              <h2 className="order-title">{order.productName}</h2>
              <p className="order-info">Product ID: {order.productId}</p>
              <p className="order-info">Category: {order.category}</p>
              <p className="order-info">Order Value: ${order.orderValue}</p>
              <p className="order-info">Quantity: {order.quantity}</p>
              <p className="order-info">Unit: {order.unit}</p>
              <p className="order-info">Buying Price: ${order.buyingPrice}</p>
              <p className="order-info">
                Delivery Date: {new Date(order.deliveryDate).toLocaleDateString()}
              </p>
              <p className="order-info">
                Notify On Delivery: {order.notifyOnDelivery ? "Yes" : "No"}
              </p>
            </div>
          ))}
      </div>
      {filteredOrders.length > ordersPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredOrders.length / ordersPerPage)}
          onPageChange={setCurrentPage}
        />
      )}
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={handleCloseModal} />
      )}
      <ToastContainer />
    </div>
  );
};

export default OrdersManagement;
