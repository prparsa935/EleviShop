import { Route, useNavigate } from "react-router";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import MyOrders from "../components/myorder/MyOrders";
import NavBar from "../components/navbar/NavBar";
import ProfileSidebar from "../components/profilesidebar/ProfileSidebar";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import PersonInformaionForm from "../components/personinformationform/PersonInformaionForm";
import { getPerson } from "../api/personApi";
import ToastList from "../components/toastlist/ToastList";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [person, setPerson] = useState(null);
  const [toastList, setToastList] = useState([]);
  const [personFormModalActive, setPersonFormModalActive] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    getPerson(setPerson, setToastList);
  }, []);
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
          {/* my orders */}

          <MyOrders />
        </div>
      </div>
    </div>
  );
};
export default Profile;
