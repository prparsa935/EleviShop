import { useState } from "react";
import AdminSideBar from "../components/adminsidebar/AdminSideBar";
import InsertProductForm from "../components/insertproductform/InsertProductForm";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";

const InsertProduct = () => {
  const [errors, setErrors] = useState([]);
  const [toastList, setToastList] = useState([]);

  return (
    <div className="profile-page">
      <div className=" absolute top-0 w-100">
        {toastList?.map((toast) => {
          return (
            <Alert duration={5000} type={toast.type}>
              {toast.message}
            </Alert>
          );
        })}
      </div>
      <NavBar />
      <MobileFooter />
      <div className="mx-auto max-w-screen-xl grid grid-cols-7  mt-10">
        <div className="lg:col-span-2 lg:order-1 col-span-12 order-2">
          <AdminSideBar />
        </div>
        <div className="lg:col-span-5 lg:order-2 order-1 col-span-12 lg:mr-4">
          {/* my orders */}
          <InsertProductForm errors={errors}></InsertProductForm>
        </div>
      </div>
    </div>
  );
};
export default InsertProduct;
