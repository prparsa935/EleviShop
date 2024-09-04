import { useState } from "react";
import AdminSideBar from "../components/adminsidebar/AdminSideBar";
import InsertBrandForm from "../components/insertbrandform/InsertBrandForm";
import InsertColorForm from "../components/insertcolorform/InsertColorForm";

import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";

const InsertBrand = () => {
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
          <InsertBrandForm errors={errors}></InsertBrandForm>
        </div>
      </div>
    </div>
  );
};
export default InsertBrand;