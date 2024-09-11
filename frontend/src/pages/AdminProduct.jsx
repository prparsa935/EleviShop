import { useState } from "react";
import AdminBrandC from "../components/Adminbrandc/AdminBrandC";
import AdminColorC from "../components/admincolorc/AdminColorC";
import AdminProductC from "../components/adminproductc/AdminProductC";

import AdminSideBar from "../components/adminsidebar/AdminSideBar";
import MobileFooter from "../components/mobilefooter/MobileFooter";

import NavBar from "../components/navbar/NavBar";
import deleteItem from "../api/delete";
import DeleteModal from "../components/deletemodal/DeleteModal";
import ToastList from "../components/toastlist/ToastList";

const AdminProduct = () => {
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [itemSelectedForDelete, setItemSelectedForDelete] = useState(null);

  const [toastList, setToastList] = useState([]);

  const handleDeleteItem = (itemId) => {
    setDeleteModalActive(true);
    setItemSelectedForDelete(itemId);
  };
  const handleDeleteConfirm = () => {
    deleteItem("product/admin/delete/", itemSelectedForDelete, setToastList);
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
          <AdminProductC handleDeleteItem={handleDeleteItem}></AdminProductC>
        </div>
      </div>
    </div>
  );
};
export default AdminProduct;
