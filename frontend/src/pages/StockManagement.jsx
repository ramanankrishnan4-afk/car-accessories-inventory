export default function StockManagement({
  accessories,
  loading,
  refreshInventory,
  handleStockAdjustment,
  selectedAccessoryId,
  setSelectedAccessoryId,
  movementType,
  setMovementType,
  quantity,
  setQuantity,
  note,
  setNote,
  movementLoading,
  fetchMovements,
  movements,
}) {
  return (
    <>
      <div className="page-header">
        <div>
          <h1>Stock Management</h1>
          <p>Add stock, reduce stock, and view movement history.</p>
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
            <h2>Update Stock</h2>
            <p>Select an accessory and enter the adjustment details.</p>
          </div>
        </div>

        <form className="stock-form" onSubmit={handleStockAdjustment}>
          <div className="form-group">
            <label htmlFor="stockAccessory">Select Accessory</label>

            <select
              id="stockAccessory"
              value={selectedAccessoryId}
              onChange={(event) => setSelectedAccessoryId(event.target.value)}
              required
              disabled={loading || accessories.length === 0}
            >
              {accessories.length === 0 ? (
                <option value="">No accessories available</option>
              ) : (
                accessories.map((item) => (
                  <option key={item.id} value={String(item.id)}>
                    {item.name} (Stock: {item.stockQuantity})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="movementType">Movement Type</label>

            <select
              id="movementType"
              value={movementType}
              onChange={(event) => setMovementType(event.target.value)}
              required
            >
              <option value="ADD">Add Stock</option>
              <option value="REDUCE">Reduce Stock</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>

            <input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder="Enter quantity"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">Note</label>

            <input
              id="note"
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="e.g. New stock received"
            />
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={loading || accessories.length === 0}
          >
            {movementType === "ADD" ? "Add Stock" : "Reduce Stock"}
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Stock Movement History</h2>
            <p>Review previously recorded stock changes.</p>
          </div>

          <button
            className="refresh-button"
            type="button"
            onClick={() => fetchMovements()}
            disabled={movementLoading}
          >
            {movementLoading ? "Loading..." : "Refresh History"}
          </button>
        </div>

        {movementLoading ? (
          <p className="empty-message">Loading stock history...</p>
        ) : movements.length === 0 ? (
          <p className="empty-message">No stock movements found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Movement ID</th>
                  <th>Accessory</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Previous Stock</th>
                  <th>New Stock</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td>{movement.id}</td>
                    <td>
                      {movement.accessoryName ||
                        movement.accessory?.name ||
                        `Accessory #${movement.accessoryId ?? "-"}`}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          movement.movementType === "ADD"
                            ? "status-available"
                            : "status-low"
                        }`}
                      >
                        {movement.movementType || "-"}
                      </span>
                    </td>
                    <td>{movement.quantity ?? "-"}</td>
                    <td>{movement.previousStock ?? "-"}</td>
                    <td>{movement.newStock ?? "-"}</td>
                    <td>{movement.note || "-"}</td>
                    <td>
                      {movement.createdAt
                        ? new Date(movement.createdAt).toLocaleString()
                        : "-"}
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