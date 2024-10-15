import { useContext, useEffect, useState } from "react";

import ProductInCartBox from "../components/productincartbox/ProductInCartBox";

import AuthContext from "../context/AuthContext";

import digiImg from "../assets/img/digi.png";
import { useNavigate } from "react-router";
import SubmitOrderBox from "../components/submitorderbox/SubmitOrderBox";
import AddressInOrder from "../components/addressinorder/AddressInOrder";

import Alert from "../components/alert/Alert";
import PersonInformaionForm from "../components/personinformationform/PersonInformaionForm";
import { getPerson } from "../api/personApi";
import PageLoading from "../components/pageloading/PageLoading";
const Payment = () => {
  const { access } = useContext(AuthContext);
  const [person, setPerson] = useState(null);
  const [prices, setPrices] = useState();
  const [versionId, setVersionId] = useState(0);

  const [toastList, setToastList] = useState([]);
  const navigate = useNavigate();
  const { shoppingCart, updateShoppingCart, calculatePrice } =
    useContext(AuthContext);
  const [price, setPrice] = useState({
    totalPurePrice: 0,
    totalPrice: 0,
    totalOff: 0,
  });

  const [personFormModalActive, setPersonFormModalActive] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    updateShoppingCart(setLoading);
  }, []);
  useEffect(() => {
    getPerson(setPerson, setToastList);
  }, [personFormModalActive]);
  useEffect(() => {
    calculatePrice(setPrice);
  }, [shoppingCart]);
  if (loading) {
    return <PageLoading></PageLoading>;
  }
  return (
    <div className="payment-page ">
      {/* alerts container */}
      <div className=" absolute w-100">
        {toastList?.map((toast) => {
          return (
            <Alert duration={5000} type={toast.type}>
              {toast.message}
            </Alert>
          );
        })}
      </div>

      <PersonInformaionForm
        setToastList={setToastList}
        person={person}
        setPersonFormModalActive={setPersonFormModalActive}
        personFormModalActive={personFormModalActive}
      />
      <div className="mx-auto max-w-screen-xl mt-10 border relative ">
        <div className="flex justify-center p-4  ">
          <img className="w-24" src={digiImg}></img>
        </div>
        <div className=" lg:absolute right-0 top-0 p-4 flex items-center font-semibold text-lg ">
          <i
            onClick={() => navigate("/cart")}
            class="fa-regular fa-arrow-right ml-2 cursor-pointer "
          ></i>
          <span>تکمیل سفارش</span>
        </div>
      </div>
      <div className="mx-auto max-w-screen-xl">
        <div className="flex mt-10 ">
          {/* all cart products box */}
          <div className="grow">
            <AddressInOrder
              setPersonFormModalActive={setPersonFormModalActive}
              person={person}
            />
            <div className=" flex flex-col border rounded-md ml-3 px-7 py-3">
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <span className=" font-semibold text-lg">سبد خرید شما</span>
                </div>
                <span className=" text-neutral-500 text-sm">
                  {shoppingCart.length} کالا
                </span>
              </div>
              {shoppingCart.map((productInCart, index) => (
                <ProductInCartBox
                  key={index}
                  versionId={versionId}
                  setPrices={setPrices}
                  productInCart={{
                    productInCart: productInCart,
                    productInCartIndex: index,
                  }}
                ></ProductInCartBox>
              ))}
            </div>
          </div>
          <div>
            <SubmitOrderBox
              setToastList={setToastList}
              price={price}
            ></SubmitOrderBox>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Payment;
