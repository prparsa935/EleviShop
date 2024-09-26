import { useEffect, useState } from "react";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";
import OrdersTabBox from "../components/orderstabbox/OrdersTabBox";

import ProfileSidebar from "../components/profilesidebar/ProfileSidebar";
import ToastList from "../components/toastlist/ToastList";
import PageLoading from "../components/pageloading/PageLoading";
import { findOrderByState } from "../api/order";

const Orders = () => {
  const [toastList, setToastList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  useEffect(() => {
    findOrderByState("current", setCurrentOrders, setToastList, setLoading);
    findOrderByState("canceled", setCanceledOrders, setToastList);
    findOrderByState("delivered", setDeliveredOrders, setToastList);
  }, []);
  if (loading) {
    return <PageLoading></PageLoading>;
  }
  return (
    <div className="profile-page">
      <NavBar />
      <MobileFooter />
      <ToastList toastList={toastList}></ToastList>
      <div className="mx-auto max-w-screen-xl grid grid-cols-7  mt-10">
        <div className="lg:col-span-2 lg:order-1 col-span-12 order-2">
          <ProfileSidebar />
        </div>
        <div className="lg:col-span-5 lg:order-2 order-1 col-span-12 lg:mr-4">
          {/* my orders */}
          <OrdersTabBox
            currentOrders={currentOrders}
            deliveredOrders={deliveredOrders}
            canceledOrders={canceledOrders}
          ></OrdersTabBox>
        </div>
      </div>
    </div>
  );
};
export default Orders;
