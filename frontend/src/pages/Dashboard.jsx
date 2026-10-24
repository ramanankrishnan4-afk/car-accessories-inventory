const LOW_STOCK_LIMIT = 5;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

function Dashboard({ accessories, loading, onRefresh }) {
  const totalProducts = accessories.length;

  const totalUnits = accessories.reduce(
    (total, item) => total + (Number(item.stockQuantity) || 0),
    0,
  );

  const inventoryValue = accessories.reduce(
    (total, item) =>
      total + (Number(item.price) || 0) * (Number(item.stockQuantity) || 0),
    0,
  );

  const lowStockAccessories = accessories.filter(
    (item) => Number(item.stockQuantity) <= LOW_STOCK_LIMIT,
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your car accessories inventory.</p>
        </div>

        <button
          className="refresh-button"
          onClick={onRefresh}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Inventory"}
        </button>
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">Total Products</span>
          <h2>{totalProducts}</h2>
          <p>Different accessories</p>
        </div>

        <div className="summary-card">
          <span className="summary-label">Total Units</span>
          <h2>{totalUnits}</h2>
          <p>Units currently in stock</p>
        </div>

        <div className="summary-card">
          <span className="summary-label">Inventory Value</span>
          <h2>{formatCurrency(inventoryValue)}</h2>
          <p>Price multiplied by quantity</p>
        </div>

        <div className="summary-card">
          <span className="summary-label">Low Stock Items</span>
          <h2>{lowStockAccessories.length}</h2>
          <p>Products with 5 units or fewer</p>
        </div>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Inventory Overview</h2>
            <p>All accessories currently in your system.</p>
          </div>
        </div>

        {loading ? (
          <p className="empty-message">Loading inventory...</p>
        ) : accessories.length === 0 ? (
          <p className="empty-message">No accessories found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Accessory Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {accessories.map((item) => {
                  const stock = Number(item.stockQuantity) || 0;

                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.category || "Uncategorized"}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{stock}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            stock <= LOW_STOCK_LIMIT
                              ? "status-low"
                              : "status-available"
                          }`}
                        >
                          {stock <= LOW_STOCK_LIMIT ? "Low Stock" : "Available"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Low Stock Alerts</h2>
            <p>Products that may need replenishment.</p>
          </div>
        </div>

        {lowStockAccessories.length === 0 ? (
          <p className="empty-message">All products have sufficient stock.</p>
        ) : (
          <div className="low-stock-list">
            {lowStockAccessories.map((item) => (
              <div className="low-stock-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.category || "Uncategorized"}</p>
                </div>

                <span className="status-badge status-low">
                  {item.stockQuantity} left
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Dashboard;
