import { useNavigate } from "react-router";
import ProductInCartBox from "../productincartbox/ProductInCartBox";
import ProductInOrderBox from "../productinorderbox/ProductInOrderBox";
import { formatNumber } from "../../utils/helperMehods";

const OrderDetailsC = ({ order }) => {
  const navigate = useNavigate();
  return (
    <div className=" border rounded flex flex-col">
      {/* header */}
      <div className=" border-b  p-5 flex items-center">
        <i
          onClick={() => navigate("/profile/orders")}
          class="ml-2  fa-solid fa-arrow-right cursor-pointer"
        ></i>
        <span className=" font-semibold text-lg">جزیات سفارش</span>
      </div>
      {/* order ovarall details and person details */}
      <div className=" flex flex-col gap-y-10 p-5 border-b text-xs lg:text-sm font-semibold">
        {/* order ovarall details */}
        <div className="flex lg:flex-row flex-col lg:gap-x-10 gap-y-3">
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-slate-500 ">کد پیگیری سفارش</span>
            <span className="font-semibold">{order?.trackingCode}</span>
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-slate-500 ">تاریخ ثبت سفارش</span>
            <div className="flex gap-x-1 font-semibold">
              {order?.faDateCreated}
              {/* <span>۱۸</span>
              <span> شهریور</span>
              <span>۱۳۹۷</span> */}
            </div>
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-slate-500 ">وضعیت سفارش</span>
            <div className="flex gap-x-1 font-semibold">
              <span>{order?.orderStatus}</span>

              <i class="fa-solid fa-check text-green-400 ml-1"></i>
            </div>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-x-10 gap-y-2">
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-slate-500 ">تحویل گیرنده</span>
            <span className="font-semibold">
              {order?.person?.firstName} {order?.person?.lastName}
            </span>
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-slate-500 ">شماره موبایل</span>
            <div className="font-semibold">
              <span>{order?.person?.phoneNumber}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-x-2 items-center justify-between lg:justify-normal">
          <span className=" text-slate-500 ">ادرس</span>
          <span className="font-semibold">{order?.person?.addressLine}</span>
        </div>
      </div>

      <div className=" flex flex-col gap-y-10 p-5 border-b text-sm lg:text-base font-semibold">
        {/* order ovarall details */}
        <div className="flex lg:flex-row flex-col lg:gap-x-10 gap-y-3">
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-slate-500 ">مبلغ</span>
            <span className="font-semibold">
              {" "}
              {formatNumber(order?.totalOrderPrice)} تومان
            </span>
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-slate-500 ">سود شما از خرید</span>
            <div className="flex gap-x-1 font-semibold">
              {formatNumber(order?.totalOrderOffPrice)} تومان
              {/* <span>۱۸</span>
              <span> شهریور</span>
              <span>۱۳۹۷</span> */}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="border">
          {order?.orderInventories?.map((orderInventory) => {
            return (
              <ProductInOrderBox
                orderInventory={orderInventory}
              ></ProductInOrderBox>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default OrderDetailsC;
