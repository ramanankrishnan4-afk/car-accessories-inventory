
export default function Accessories({
  accessories,
  loading,
  savingAccessory,
  accessoryForm,
  editingAccessoryId,
  searchTerm,
  filteredAccessories,
  refreshInventory,
  handleAccessorySubmit,
  handleAccessoryInput,
  resetAccessoryForm,
  setSearchTerm,
  formatCurrency,
  handleEditAccessory,
  handleDeleteAccessory,
}) {
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Accessory Management</h1>
          <p>Add, edit, search, and delete car accessories.</p>
        </div>

        <button
          className="refresh-button"
          onClick={refreshInventory}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Inventory"}
        </button>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>
              {editingAccessoryId !== null
                ? "Edit Accessory"
                : "Add New Accessory"}
            </h2>
            <p>
              {editingAccessoryId !== null
                ? "Update the selected product details."
                : "Enter the details of the new product."}
            </p>
          </div>
        </div>

        <form className="accessory-form" onSubmit={handleAccessorySubmit}>
          <div className="form-group">
            <label htmlFor="name">Accessory Name *</label>
            <input
              id="name"
              name="name"
              value={accessoryForm.name}
              onChange={handleAccessoryInput}
              placeholder="e.g. LED Headlight"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              id="category"
              name="category"
              value={accessoryForm.category}
              onChange={handleAccessoryInput}
              placeholder="e.g. Lighting"
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={accessoryForm.price}
              onChange={handleAccessoryInput}
              placeholder="e.g. 1500"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stockQuantity">Stock Quantity *</label>
            <input
              id="stockQuantity"
              name="stockQuantity"
              type="number"
              min="0"
              step="1"
              value={accessoryForm.stockQuantity}
              onChange={handleAccessoryInput}
              placeholder="e.g. 25"
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={accessoryForm.description}
              onChange={handleAccessoryInput}
              placeholder="Enter product details"
              rows="3"
              maxLength={1000}
            />
          </div>

          <div className="form-actions form-group-full">
            <button
              className="primary-button"
              type="submit"
              disabled={savingAccessory}
            >
              {savingAccessory
                ? "Saving..."
                : editingAccessoryId !== null
                  ? "Update Accessory"
                  : "Add Accessory"}
            </button>

            {editingAccessoryId !== null && (
              <button
                className="secondary-button"
                type="button"
                onClick={resetAccessoryForm}
                disabled={savingAccessory}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>All Accessories</h2>
            <p>{accessories.length} products in your inventory.</p>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="Search name or category..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search accessories by name or category"
          />
        </div>

        {loading ? (
          <p className="empty-message">Loading accessories...</p>
        ) : filteredAccessories.length === 0 ? (
          <p className="empty-message">
            {accessories.length === 0
              ? "No accessories found. Add your first product above."
              : "No accessories match your search."}
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAccessories.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.category || "-"}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{item.stockQuantity}</td>
                    <td>{item.description || "-"}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="edit-button"
                          type="button"
                          onClick={() => handleEditAccessory(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          type="button"
                          onClick={() => handleDeleteAccessory(item)}
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
    </>
  );
}
