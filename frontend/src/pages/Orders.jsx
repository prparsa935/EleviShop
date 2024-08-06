import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";
import OrdersTabBox from "../components/orderstabbox/OrdersTabBox";

import ProfileSidebar from "../components/profilesidebar/ProfileSidebar";

const Orders = () => {
  return (
    <div className="profile-page">
      <NavBar />
      <MobileFooter />
      <div className="mx-auto max-w-screen-xl grid grid-cols-7  mt-10">
        <div className="lg:col-span-2 lg:order-1 col-span-12 order-2">
          <ProfileSidebar />
        </div>
        <div className="lg:col-span-5 lg:order-2 order-1 col-span-12 lg:mr-4">
          {/* my orders */}
          <OrdersTabBox></OrdersTabBox>
        </div>
      </div>
    </div>
  );
};
export default Orders
