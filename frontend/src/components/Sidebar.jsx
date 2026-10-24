import { NavLink } from "react-router-dom";

function Sidebar() {
    const menuItems = [
        { name: "Dashboard", path: "/", icon: "▦" },
        { name: "Accessory Management", path: "/accessories", icon: "▣" },
        { name: "Stock Management", path: "/stock", icon: "⇅" },
        { name: "Categories", path: "/categories", icon: "▤" }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">CA</div>
                <div>
                    <h2>Car Accessories</h2>
                    <p>Inventory System</p>
                </div>
            </div>

            <p className="sidebar-section-title">MAIN MENU</p>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) =>
                            isActive ? "sidebar-link active" : "sidebar-link"
                        }
                    >
                        <span className="sidebar-link-icon">{item.icon}</span>
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p>Inventory Management</p>
                <span>Spring Boot + React</span>
            </div>
        </aside>
    );
}

export default Sidebar;
