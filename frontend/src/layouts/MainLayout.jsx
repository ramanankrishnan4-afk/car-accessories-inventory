import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const pageDetails = {
  "/": {
    title: "Dashboard",
    subtitle: "Overview of your inventory and business activity",
  },
  "/accessories": {
    title: "Accessory Management",
    subtitle: "Manage your car accessories and product details",
  },
  "/stock": {
    title: "Stock Management",
    subtitle: "Track stock movements and inventory levels",
  },
  "/categories": {
    title: "Categories",
    subtitle: "Organize your car accessories",
  },
};

export default function MainLayout() {
  const location = useLocation();

  const currentPage = pageDetails[location.pathname] ?? {
    title: "AutoStock",
    subtitle: "Car Accessories Inventory Management",
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-panel">
        <Topbar
          title={currentPage.title}
          subtitle={currentPage.subtitle}
        />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
