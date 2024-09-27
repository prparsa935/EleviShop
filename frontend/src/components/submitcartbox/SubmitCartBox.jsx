import { useEffect } from "react";
import Button from "../Button/Button";
import { useNavigate } from "react-router";
import { formatNumber } from "../../utils/helperMehods";

const SubmitCartBox = ({price}) => {
  const navigate=useNavigate()
  return (
    <div className="lg:w-[300px] w-screen left-0 bg-white  justify-between items-center lg:items-stretch fixed bottom-[70px] flex lg:flex-col gap-y-4 border p-5 lg:sticky lg:top-[155px]">
      <div className="lg:flex   hidden justify-between text-neutral-500 font-semibold  ">
        <span>قیمت کالا ها </span>
        <div>
          <span className="ml-1">{formatNumber(price?.totalPurePrice)}</span>
          <span>تومان</span>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col justify-between items-center  font-semibold lg:order-none order-2  ">
        <span>جمع سبد خرید</span>
        <div>
          <span className="ml-1">{formatNumber(price?.totalPrice)}</span>
          <span>تومان</span>
        </div>
      </div>
      <div className="lg:flex hidden justify-between text-rose-600 font-semibold   ">
        <span>سود شما از خرید</span>
        <div>
          <span className="ml-1">{formatNumber(price?.totalOff)}</span>
          <span>تومان</span>
        </div>
      </div>
      <Button
        onClick={()=>{
          navigate('/payment')


        }}
        size="lg"
        shape="rounded-xl"
        bgColor="bg-rose-500"
        txtColor="text-white"
      >
        تایید و تکمیل سفارش
      </Button>
    </div>
  );
};
export default SubmitCartBox;
