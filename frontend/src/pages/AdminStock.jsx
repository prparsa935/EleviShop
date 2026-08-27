import { useState } from "react";
import AdminStockC from "../components/adminstockc/AdminStockC";
import AdminSideBar from "../components/adminsidebar/AdminSideBar";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";
import ToastList from "../components/toastlist/ToastList";

const AdminStock = () => {
  const [toastList, setToastList] = useState([]);
  return (
    <div className="profile-page">
      <NavBar />
      <MobileFooter />
      <ToastList toastList={toastList} />
      <div className="mx-auto max-w-screen-xl grid grid-cols-7 mt-10">
        <div className="lg:col-span-2 lg:order-1 col-span-12 order-2">
          <AdminSideBar />
        </div>
        <div className="lg:col-span-5 lg:order-2 order-1 col-span-12 lg:mr-4">
          <AdminStockC setToastList={setToastList} />
        </div>
      </div>
    </div>
  );
};
export default AdminStock;
