import { useContext, useEffect, useRef, useState } from "react";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";
import OrdersTabBox from "../components/orderstabbox/OrdersTabBox";

import ProfileSidebar from "../components/profilesidebar/ProfileSidebar";
import ToastList from "../components/toastlist/ToastList";
import PageLoading from "../components/pageloading/PageLoading";
import { findOrderByState } from "../api/order";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getPerson } from "../api/personApi";
import PersonInformaionForm from "../components/personinformationform/PersonInformaionForm";

const createOrdersTabState = () => ({
  orders: [],
  page: 1,
  hasMore: true,
  total: 0,
});

const ORDERS_TAB_KEYS = ["current", "delivered", "canceled"];

const Orders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [toastList, setToastList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabsData, setTabsData] = useState(() =>
    Object.fromEntries(ORDERS_TAB_KEYS.map((key) => [key, createOrdersTabState()]))
  );
  // InfiniteScroll callbacks always need the latest page number
  const tabsDataRef = useRef(tabsData);
  useEffect(() => {
    tabsDataRef.current = tabsData;
  }, [tabsData]);
  const [personFormModalActive, setPersonFormModalActive] = useState(false);
  const [person, setPerson] = useState(null);

  const patchTab = (tabKey, patch) =>
    setTabsData((prev) => ({
      ...prev,
      [tabKey]: { ...prev[tabKey], ...patch(prev[tabKey]) },
    }));

  const loadOrders = (tabKey, { reset = false } = {}) => {
    const tabState = tabsDataRef.current[tabKey];
    const page = reset ? 1 : tabState.page;
    findOrderByState(
      tabKey,
      (updater) =>
        patchTab(tabKey, (tab) => ({
          orders:
            typeof updater === "function" ? updater(tab.orders) : updater,
        })),
      setToastList,
      setLoading,
      page,
      (nextPage) => patchTab(tabKey, () => ({ page: nextPage })),
      (hasMore) => patchTab(tabKey, () => ({ hasMore })),
      (total) => patchTab(tabKey, () => ({ total }))
    );
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    getPerson(setPerson, setToastList);
    loadOrders("current");
    loadOrders("canceled");
    loadOrders("delivered");
  }, []);
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
          <ProfileSidebar setPersonFormModalActive={setPersonFormModalActive} person={person} />
        </div>
        <div className="lg:col-span-5 lg:order-2 order-1 col-span-12 lg:mr-4">
          {/* my orders */}
          <OrdersTabBox
            tabsData={tabsData}
            loadMore={{
              current: () => loadOrders("current"),
              delivered: () => loadOrders("delivered"),
              canceled: () => loadOrders("canceled"),
            }}
          ></OrdersTabBox>
        </div>
      </div>
    </div>
  );
};
export default Orders;
