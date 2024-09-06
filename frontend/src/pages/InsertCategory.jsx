import { useState } from "react";
import AdminSideBar from "../components/adminsidebar/AdminSideBar";
import InsertCategoryForm from "../components/insertcategoryform/InsertCategoryForm";
import InsertProductForm from "../components/insertproductform/InsertProductForm";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";
import Alert from "../components/alert/Alert";

const InsertCategory = () => {
  const [errors, setErrors] = useState([]);
  const [toastList, setToastList] = useState([]);

  return (
    <div className="profile-page">

      <NavBar />
      <div className=" sticky top-24 w-100 h-0 ">
        {toastList?.map((toast) => {
          return (
            <Alert duration={5000} type={toast.type}>
              {toast.message}
            </Alert>
          );
        })}
      </div>
      <MobileFooter />
      <div className="mx-auto max-w-screen-xl grid grid-cols-7  mt-10">
        <div className="lg:col-span-2 lg:order-1 col-span-12 order-2">
          <AdminSideBar />
        </div>
        <div className="lg:col-span-5 lg:order-2 order-1 col-span-12 lg:mr-4">
          <InsertCategoryForm
            errors={errors}
            setErrors={setErrors}
            setToastList={setToastList}
          ></InsertCategoryForm>
        </div>
      </div>
    </div>
  );
};
export default InsertCategory;
