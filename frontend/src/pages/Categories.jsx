
import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadCategories() {
    try {
      setError("");
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

 useEffect(() => {
  let cancelled = false;

  async function fetchCategories() {
    try {
      const data = await getCategories();

      if (!cancelled) {
        setCategories(data);
      }
    } catch (err) {
      if (!cancelled) {
        setError(err.message || "Failed to load categories.");
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  fetchCategories();

  return () => {
    cancelled = true;
  };
}, []);

  function resetForm() {
    setName("");
    setDescription("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const category = {
      name: name.trim(),
      description: description.trim(),
    };

    if (!category.name) {
      setError("Please enter a category name.");
      return;
    }

    try {
      if (editingId !== null) {
        await updateCategory(editingId, category);
        setMessage("Category updated successfully.");
      } else {
        await createCategory(category);
        setMessage("Category added successfully.");
      }

      resetForm();
      await loadCategories();
    } catch (err) {
      setError(err.message || "Unable to save category.");
    }
  }

  function handleEdit(category) {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteCategory(id);
      setMessage("Category deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadCategories();
    } catch (err) {
      setError(err.message || "Unable to delete category.");
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Category Management</h1>
          <p>Organize your car accessories by category.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <section className="panel">
        <div className="panel-header">
          <h2>{editingId !== null ? "Edit Category" : "Add Category"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="accessory-form">
          <div className="form-group">
            <label htmlFor="categoryName">Category Name *</label>
            <input
              id="categoryName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Engine Parts"
              maxLength={60}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryDescription">Description</label>
            <input
              id="categoryDescription"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter a short description"
              maxLength={250}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId !== null ? "Update Category" : "Add Category"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Categories</h2>
          <span>{categories.length} total</span>
        </div>

        {loading ? (
          <p>Loading categories...</p>
        ) : categories.length === 0 ? (
          <div className="empty-state">
            <h3>No categories yet</h3>
            <p>Add your first category using the form above.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description || "No description"}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDelete(category.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Categories;
