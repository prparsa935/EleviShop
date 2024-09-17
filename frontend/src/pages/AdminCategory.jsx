import { useSearchParams } from "react-router-dom";
import deleteItem from "../api/delete";
import AdminBrandC from "../components/Adminbrandc/AdminBrandC";
import AdminCategoryC from "../components/admincategoryc/AdminCategoryC";
import AdminColorC from "../components/admincolorc/AdminColorC";

import AdminSideBar from "../components/adminsidebar/AdminSideBar";
import DeleteModal from "../components/deletemodal/DeleteModal";
import MobileFooter from "../components/mobilefooter/MobileFooter";

import NavBar from "../components/navbar/NavBar";
import { useState } from "react";
import ToastList from "../components/toastlist/ToastList";

const AdminCategory = () => {
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [toastList, setToastList] = useState([]);

  const handleDeleteConfirm = () => {
    deleteItem(
      "category/admin/delete/",
      searchParams.get("categoryId"),
      setToastList
    );
  };
  return (
    <div className="profile-page">
      <NavBar />
      <MobileFooter />
      <DeleteModal
        setDeleteModalActive={setDeleteModalActive}
        deleteModalActive={deleteModalActive}
        onDelete={handleDeleteConfirm}
      ></DeleteModal>
      <ToastList toastList={toastList} />;
      <div className="mx-auto max-w-screen-xl grid grid-cols-7  mt-10">
        <div className="lg:col-span-2 lg:order-1 col-span-12 order-2">
          <AdminSideBar />
        </div>
        <div className="lg:col-span-5 lg:order-2 order-1 col-span-12 lg:mr-4">
          <AdminCategoryC
            setDeleteModalActive={setDeleteModalActive}
          ></AdminCategoryC>
        </div>
      </div>
    </div>
  );
};
export default AdminCategory;
