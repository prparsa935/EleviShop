import { useState } from "react";
import AdminSideBar from "../components/adminsidebar/AdminSideBar";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import MyOrders from "../components/myorder/MyOrders";
import NavBar from "../components/navbar/NavBar";
import AnalyticsDashboard from "../components/admin/AnalyticsDashboard";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("orders");

  const tabs = [
    { key: "orders", label: "سفارش‌ها", icon: "fa-regular fa-clipboard-list" },
    { key: "analytics", label: "آنالیتیکس", icon: "fa-regular fa-chart-line" },
  ];

  return (
    <div className="profile-page">
      <NavBar />
      <MobileFooter />
      <div className="mx-auto max-w-screen-xl grid grid-cols-7  mt-10">
        <div className="lg:col-span-2 lg:order-1 col-span-12 order-2">
          <AdminSideBar />
        </div>
        <div className="lg:col-span-5 lg:order-2 order-1 col-span-12 lg:mr-4">
          {/* tabs */}
          <div className="glass rounded-2xl flex gap-x-2 p-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={
                  "flex items-center gap-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all " +
                  (activeTab === tab.key
                    ? "bg-[var(--color-gold-light)] text-[var(--color-white)] border-r-2 border-[var(--color-gold)]"
                    : "text-[var(--sub-text-color)] hover:text-[var(--color-white)]")
                }
              >
                <i className={tab.icon + " gold-text"}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* tab content */}
          {activeTab === "orders" ? <MyOrders /> : <AnalyticsDashboard />}
        </div>
      </div>
    </div>
  );
};
export default Admin;
