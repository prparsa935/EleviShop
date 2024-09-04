import AdminSideBar from "../components/adminsidebar/AdminSideBar";
import InsertProductForm from "../components/insertproductform/InsertProductForm";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";

const InsertProduct = () => {
  return (
    <div className="profile-page">
      <NavBar />
      <MobileFooter />
      <div className="mx-auto max-w-screen-xl grid grid-cols-7  mt-10">
        <div className="lg:col-span-2 lg:order-1 col-span-12 order-2">
          <AdminSideBar />
        </div>
        <div className="lg:col-span-5 lg:order-2 order-1 col-span-12 lg:mr-4">
          {/* my orders */}
          <InsertProductForm></InsertProductForm>
        </div>
      </div>
    </div>
  );
};
export default InsertProduct;
