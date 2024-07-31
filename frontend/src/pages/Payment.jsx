import { useContext, useEffect, useState } from "react";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";
import ProductInCartBox from "../components/productincartbox/ProductInCartBox";
import SubmitCartBox from "../components/submitcartbox/SubmitCartBox";
import AuthContext from "../context/AuthContext";
import useDidUpdateEffect from "../hooks/useDidUpdateEffect";

import digiImg from "../assets/img/digi.svg";
import { useNavigate } from "react-router";
import SubmitOrderBox from "../components/submitorderbox/SubmitOrderBox";
import AddressInOrder from "../components/addressinorder/AddressInOrder";
import Modal from "../components/modal/Modal";
import Input from "../components/input/Input";
import Button from "../components/Button/Button";
import Alert from "../components/alert/Alert";
const Payment = () => {
  const [prices, setPrices] = useState();
  const [versionId, setVersionId] = useState(0);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { shoppingCart, updateShoppingCart, calculatePrice } =
    useContext(AuthContext);
  const [price, setPrice] = useState({
    totalPurePrice: 0,
    totalPrice: 0,
    totalOff: 0,
  });
  const [personFormModalActive, setPersonFormModalActive] = useState(false);

  useEffect(() => {
    updateShoppingCart();
  }, []);
  useEffect(() => {
    calculatePrice(setPrice);
  }, [shoppingCart]);

  return (
    <div className="payment-page ">
      {/* alerts container */}
      <div className=" absolute w-100">
        {errors.map(() => {
          return (
            <Alert duration={5000} title={"کیر خر"} type="success">
              مشکلی نیست اینجا اطلاعاتی در باره کیر خر موجود است
            </Alert>
          );
        })}

      </div>

      <Modal
        setPersonFormModalActive={setPersonFormModalActive}
        enable={personFormModalActive}
        className="lg:h-[70vh] h-full lg:w-[550px] w-100 p-6 rounded-2xl "
      >
        <div className="flex-col flex gap-y-4">
          <div className="  font-semibold  border-b pb-5 ">
            <span>تکمیل پروفایل</span>
          </div>
          <div className=" grid md:grid-cols-2 grid-cols-1 gap-x-2">
            <div className="flex flex-col gap-y-2">
              <label className="text-neutral-500 mr-2 font-semibold">نام</label>
              <Input></Input>
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-neutral-500 mr-2 font-semibold">
                نام خانوادگی
              </label>
              <Input></Input>
            </div>
            <div className="flex flex-col gap-y-2">
              <label className="text-neutral-500 mr-2 font-semibold">
                شماره موبایل
              </label>
              <Input></Input>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className=" text-neutral-500 mr-2 font-semibold">
              کد پستی
            </label>
            <Input></Input>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className=" text-neutral-500 mr-2 font-semibold">
              نشانی پستی
            </label>
            <Input type="textarea"></Input>
          </div>
          <Button
            size="lg"
            shape="rounded-xl"
            txtColor="text-rose-500"
            moreCss="border-rose-500"
          >
            ثبت اطلاعات
          </Button>
        </div>
      </Modal>
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
            />
            <div className=" flex flex-col border rounded-md ml-3 px-7 py-3">
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <span className=" font-semibold text-lg">سبد خرید شما</span>
                  <div>three dot</div>
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
            <SubmitOrderBox price={price}></SubmitOrderBox>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Payment;
