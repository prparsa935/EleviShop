import { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../components/navbar/NavBar";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import ProfileSidebar from "../components/profilesidebar/ProfileSidebar";
import fetchSingleItem from "../api/fetchSingleItem";
import OrderDetailsC from "../components/orderdetailsc/OrderDetailsC";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    fetchSingleItem("order/id/", orderId, setOrder);
  }, [orderId]);
  return (
    <div className="profile-page">
      <NavBar />
      <MobileFooter />
      <div className="mx-auto max-w-screen-xl grid grid-cols-7  mt-10">
        <div className="lg:col-span-2 lg:order-1 col-span-12 order-2">
          <ProfileSidebar />
        </div>
        <div className="lg:col-span-5 lg:order-2 order-1 col-span-12 lg:mr-4">
          {/* my order */}
          <OrderDetailsC order={order} />
        </div>
      </div>
    </div>
  );
};
export default OrderDetails;
