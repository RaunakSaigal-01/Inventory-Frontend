import React, { useEffect, useState } from "react";
import axios from "axios";
import AddSupplier from "../components/Supplier/AddSupplier";
import EditSupplier from "../components/Supplier/EditSupplier";
import CustomModal from "../components/Supplier/CustomModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import "./supplier.css";

const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editSupplier, setEditSupplier] = useState(null);

useEffect(() => {
fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("/api/suppliers");
setSuppliers(response.data);
setLoading(false);
    } catch (error) {
toast.error("Error fetching suppliers");
setLoading(false);
    }
  };

  const handleEditClick = (supplier) => {
setEditSupplier(supplier);
setShowEditForm(true);
  };

  const handleEditSupplier = (updatedSupplier) => {
setSuppliers(
suppliers.map((supplier) =>
supplier._id === updatedSupplier._id ? updatedSupplier : supplier
      )
    );
setShowEditForm(false);
setEditSupplier(null);
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await axios.delete(`/api/suppliers/${id}`);
setSuppliers(suppliers.filter((supplier) =>supplier._id !== id));
toast.success("Supplier deleted successfully!");
    } catch (error) {
toast.error("Error deleting supplier");
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
<div className="supplier-container">
<h1 className="supplier-title">Supplier Management</h1>
<div className="supplier-header">
<input
          type="text"
          placeholder="Search Supplier..."
          value={searchTerm}
onChange={(e) =>setSearchTerm(e.target.value)}
className="supplier-search"
        />
<button onClick={() =>setShowForm(!showForm)} className="supplier-add-btn">
<FaPlus className="supplier-add-icon" />
          {showForm ? "Hide Form" : "Add Supplier"}
</button>
</div>
      {showForm&&<AddSupplier fetchSuppliers={fetchSuppliers} />}

      {loading ? (
<div className="supplier-loader">
<ClipLoader size={50} color="#007BFF" loading={loading} />
</div>
      ) : (
<div className="supplier-grid">
          {filteredSuppliers.map((supplier) => (
<div key={supplier._id} className="supplier-card">
<div className="supplier-img-wrapper">
                {supplier.image ? (
<img src={supplier.image} alt={supplier.name} className="supplier-img" />
                ) : (
<div className="supplier-no-img">No Image</div>
                )}
</div>
<div className="supplier-overlay">
<h2>{supplier.name}</h2>
<p>{supplier.category}</p>
<p><MdPhone className="icon" /> {supplier.contactNumber}</p>
<p><MdEmail className="icon" /> {supplier.email}</p>
<p>Returns: {supplier.takesReturns ? "Yes" : "No"}</p>
</div>
<div className="supplier-actions">
<button onClick={() =>handleEditClick(supplier)} className="edit-btn">
<FaEdit />
</button>
<button onClick={() =>handleDeleteSupplier(supplier._id)} className="delete-btn">
<FaTrash />
</button>
</div>
</div>
          ))}
</div>
      )}

<CustomModal isOpen={showEditForm} onClose={() =>setShowEditForm(false)}>
<EditSupplier
          supplier={editSupplier}
onSupplierEdited={handleEditSupplier}
onClose={() =>setShowEditForm(false)}
        />
</CustomModal>

<ToastContainer />
</div>
  );
};

export default SupplierManagement;
