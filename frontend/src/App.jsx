import { useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Categories from "./pages/Categories";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Accessories from "./pages/Accessories";
import StockManagement from "./pages/StockManagement";
import MainLayout from "./layouts/MainLayout";

const API_URL = "http://localhost:8080/api/accessories";

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  stockQuantity: "",
  description: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

function App() {
  const location = useLocation();

  // Inventory data
  const [accessories, setAccessories] = useState([]);
  const [movements, setMovements] = useState([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [movementLoading, setMovementLoading] = useState(false);
  const [savingAccessory, setSavingAccessory] = useState(false);

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Stock adjustment form
  const [selectedAccessoryId, setSelectedAccessoryId] = useState("");
  const [movementType, setMovementType] = useState("ADD");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

  // Accessory form
  const [accessoryForm, setAccessoryForm] = useState(EMPTY_FORM);
  const [editingAccessoryId, setEditingAccessoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load accessories from the backend
  const fetchAccessories = useCallback(async (signal) => {
    try {
      const response = await fetch(API_URL, { signal });

      if (!response.ok) {
        throw new Error(
          `Failed to load accessories. HTTP status: ${response.status}`,
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Expected the API to return a list of accessories.");
      }

      setAccessories(data);

      setSelectedAccessoryId((currentId) => {
        const exists = data.some(
          (item) => String(item.id) === String(currentId),
        );

        if (exists) {
          return String(currentId);
        }

        return data.length > 0 ? String(data[0].id) : "";
      });

      setError("");
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("Error loading accessories:", err);
      setError(err.message || "Unable to load accessories.");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // Load stock movement history from the backend
  const fetchMovements = useCallback(async (signal) => {
    setMovementLoading(true);

    try {
      const response = await fetch(`${API_URL}/stock-movements`, {
        signal,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load stock history. HTTP status: ${response.status}`,
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid stock movement history response.");
      }

      setMovements(data);
      setError("");
    } catch (err) {
      if (err.name === "AbortError") return;

      console.error("Error loading stock history:", err);
      setError(err.message || "Unable to load stock movement history.");
    } finally {
      if (!signal?.aborted) {
        setMovementLoading(false);
      }
    }
  }, []);

  // Load accessories when the application starts
  useEffect(() => {
    const controller = new AbortController();

    async function loadAccessories() {
      await fetchAccessories(controller.signal);
    }

    loadAccessories();

    return () => controller.abort();
  }, [fetchAccessories]);

  // Load stock history on the Dashboard and Stock Management pages
  useEffect(() => {
    if (location.pathname !== "/stock" && location.pathname !== "/") {
      return;
    }

    const controller = new AbortController();

    async function loadMovements() {
      await fetchMovements(controller.signal);
    }

    loadMovements();

    return () => controller.abort();
  }, [location.pathname, fetchMovements]);

  // Refresh inventory
  const refreshInventory = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    await fetchAccessories();
  };

  // Handle accessory form input
  const handleAccessoryInput = (event) => {
    const { name, value } = event.target;

    setAccessoryForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // Reset accessory form
  const resetAccessoryForm = () => {
    setAccessoryForm(EMPTY_FORM);
    setEditingAccessoryId(null);
  };

  // Add a new accessory or update an existing one
  const handleAccessorySubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name = accessoryForm.name.trim();
    const category = accessoryForm.category.trim();
    const price = Number(accessoryForm.price);
    const stock = Number(accessoryForm.stockQuantity);

    if (!name || !category) {
      setError("Please enter the accessory name and category.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be a valid non-negative number.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock quantity must be a non-negative whole number.");
      return;
    }

    const payload = {
      name,
      category,
      price,
      stockQuantity: stock,
      description: accessoryForm.description.trim(),
    };

    setSavingAccessory(true);

    try {
      const isEditing = editingAccessoryId !== null;

      const response = await fetch(
        isEditing ? `${API_URL}/${editingAccessoryId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            `Unable to ${isEditing ? "update" : "add"} accessory.`,
        );
      }

      setSuccess(
        isEditing
          ? `${name} updated successfully.`
          : `${name} added successfully.`,
      );

      resetAccessoryForm();

      await fetchAccessories();
    } catch (err) {
      console.error("Accessory save error:", err);
      setError(err.message || "Unable to save accessory.");
    } finally {
      setSavingAccessory(false);
    }
  };

  // Load accessory details into the form for editing
  const handleEditAccessory = (accessory) => {
    setAccessoryForm({
      name: accessory.name ?? "",
      category: accessory.category ?? "",
      price: String(accessory.price ?? ""),
      stockQuantity: String(accessory.stockQuantity ?? ""),
      description: accessory.description ?? "",
    });

    setEditingAccessoryId(accessory.id);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete an accessory
  const handleDeleteAccessory = async (accessory) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${accessory.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/${accessory.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => null);

        throw new Error(
          responseData?.message ||
            responseData?.error ||
            `Unable to delete accessory. HTTP status: ${response.status}`,
        );
      }

      setSuccess(`${accessory.name} deleted successfully.`);

      if (String(editingAccessoryId) === String(accessory.id)) {
        resetAccessoryForm();
      }

      await fetchAccessories();
    } catch (err) {
      console.error("Accessory deletion error:", err);
      setError(err.message || "Unable to delete accessory.");
    }
  };

  // Add or reduce stock
  const handleStockAdjustment = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedAccessoryId) {
      setError("Please select an accessory.");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
      setError("Enter a valid positive whole-number quantity.");
      return;
    }

    const selectedAccessory = accessories.find(
      (item) => String(item.id) === String(selectedAccessoryId),
    );

    if (!selectedAccessory) {
      setError("The selected accessory could not be found.");
      return;
    }

    if (
      movementType === "REDUCE" &&
      parsedQuantity > Number(selectedAccessory.stockQuantity)
    ) {
      setError(
        `Cannot reduce ${parsedQuantity} units. Only ${selectedAccessory.stockQuantity} units are available.`,
      );
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${selectedAccessoryId}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movementType,
          quantity: parsedQuantity,
          note: note.trim(),
        }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            "Stock adjustment failed.",
        );
      }

      setSuccess(
        `Stock ${movementType === "ADD" ? "added" : "reduced"} successfully for ${selectedAccessory.name}.`,
      );

      setQuantity("");
      setNote("");

      await fetchAccessories();
      await fetchMovements();
    } catch (err) {
      console.error("Stock adjustment error:", err);
      setError(err.message || "Unable to update stock.");
    }
  };

  // Search accessories by name or category
  const filteredAccessories = accessories.filter((item) => {
    const query = searchTerm.trim().toLowerCase();

    return (
      item.name?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  });

  // Shared page props
  const commonPageProps = {
    accessories,
    loading,
    refreshInventory,
  };

  return (
    <>
      {/* Application routes */}
      <Routes>
        <Route element={<MainLayout />}>
          {/* Dashboard */}
          <Route
            path="/"
            element={
              <Dashboard {...commonPageProps} onRefresh={refreshInventory} />
            }
          />

          {/* Accessory Management */}
          <Route
            path="/accessories"
            element={
              <Accessories
                {...commonPageProps}
                savingAccessory={savingAccessory}
                accessoryForm={accessoryForm}
                editingAccessoryId={editingAccessoryId}
                searchTerm={searchTerm}
                filteredAccessories={filteredAccessories}
                handleAccessorySubmit={handleAccessorySubmit}
                handleAccessoryInput={handleAccessoryInput}
                resetAccessoryForm={resetAccessoryForm}
                setSearchTerm={setSearchTerm}
                formatCurrency={formatCurrency}
                handleEditAccessory={handleEditAccessory}
                handleDeleteAccessory={handleDeleteAccessory}
              />
            }
          />
         <Route path="/categories" element={<Categories />} />

          {/* Stock Management */}
          <Route
            path="/stock"
            element={
              <StockManagement
                {...commonPageProps}
                handleStockAdjustment={handleStockAdjustment}
                selectedAccessoryId={selectedAccessoryId}
                setSelectedAccessoryId={setSelectedAccessoryId}
                movementType={movementType}
                setMovementType={setMovementType}
                quantity={quantity}
                setQuantity={setQuantity}
                note={note}
                setNote={setNote}
                movementLoading={movementLoading}
                fetchMovements={fetchMovements}
                movements={movements}
              />
            }
          />

          {/* Redirect unknown routes to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      {/* Error and success messages */}
      {(error || success) && (
        <div className="app-messages">
          {error && (
            <div className="alert alert-error" role="alert">
              <span>{error}</span>

              <button
                type="button"
                className="alert-close"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="status">
              <span>{success}</span>

              <button
                type="button"
                className="alert-close"
                onClick={() => setSuccess("")}
                aria-label="Dismiss success message"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
