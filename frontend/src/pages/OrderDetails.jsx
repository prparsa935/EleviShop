import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../components/navbar/NavBar";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import ProfileSidebar from "../components/profilesidebar/ProfileSidebar";
import fetchSingleItem from "../api/fetchSingleItem";
import OrderDetailsC from "../components/orderdetailsc/OrderDetailsC";
import PageLoading from "../components/pageloading/PageLoading";
import PersonInformaionForm from "../components/personinformationform/PersonInformaionForm";
import AuthContext from "../context/AuthContext";
import { getPerson } from "../api/personApi";
import ToastList from "../components/toastlist/ToastList";

const OrderDetails = () => {
  const { user } = useContext(AuthContext);
  const [toastList, setToastList] = useState([]);
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [personFormModalActive, setPersonFormModalActive] = useState(false);
  const [person, setPerson] = useState(null);
  useEffect(() => {}, []);
  useEffect(() => {
    setLoading(true);
    if (!user) {
      navigate("/login");
    }
    getPerson(setPerson, setToastList);
    fetchSingleItem("order/id/", orderId, setOrder, setLoading);
  }, [orderId]);
  if (loading) {
    return <PageLoading></PageLoading>;
  }
  return (
    <div className="profile-page">
      <NavBar />
      <MobileFooter />
      <ToastList toastList={toastList}></ToastList>
      <PersonInformaionForm
        setPersonFormModalActive={setPersonFormModalActive}
        personFormModalActive={personFormModalActive}
        person={person}
        setToastList={setToastList}
      ></PersonInformaionForm>
      <div className="mx-auto max-w-screen-xl grid grid-cols-7  mt-10">
        <div className="lg:col-span-2 lg:order-1 col-span-12 order-2">
          <ProfileSidebar
            person={person}
            setPersonFormModalActive={setPersonFormModalActive}
          />
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
