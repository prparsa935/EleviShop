import { useNavigate } from "react-router";
import ProductInCartBox from "../productincartbox/ProductInCartBox";
import ProductInOrderBox from "../productinorderbox/ProductInOrderBox";
import { formatNumber } from "../../utils/helperMehods";

const OrderDetailsC = ({ order }) => {
  const navigate = useNavigate();
  return (
    <div className="glass rounded-2xl flex flex-col">
      {/* header */}
      <div className=" border-b border-[var(--glass-border)] p-5 flex items-center">
        <i
          onClick={() => navigate("/profile/orders")}
          class="ml-2  fa-solid fa-arrow-right cursor-pointer gold-text"
        ></i>
        <span className=" font-semibold text-lg text-[var(--color-white)]">جزیات سفارش</span>
      </div>
      {/* order ovarall details and person details */}
      <div className=" flex flex-col gap-y-10 p-5 border-b border-[var(--glass-border)] text-xs lg:text-sm font-semibold">
        {/* order ovarall details */}
        <div className="flex lg:flex-row flex-col lg:gap-x-10 gap-y-3">
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-[var(--sub-text-color)] ">کد پیگیری سفارش</span>
            <span className="font-semibold text-[var(--color-white)]">{order?.trackingCode}</span>
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-[var(--sub-text-color)] ">تاریخ ثبت سفارش</span>
            <div className="flex gap-x-1 font-semibold text-[var(--color-white)]">
              {order?.faDateCreated}
            </div>
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-[var(--sub-text-color)] ">وضعیت سفارش</span>
            <div className="flex gap-x-1 font-semibold text-[var(--color-white)]">
              <span>{order?.orderStatus}</span>

              <i class="fa-solid fa-check gold-text ml-1"></i>
            </div>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col gap-x-10 gap-y-2">
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-[var(--sub-text-color)] ">تحویل گیرنده</span>
            <span className="font-semibold text-[var(--color-white)]">
              {order?.person?.firstName} {order?.person?.lastName}
            </span>
          </div>
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-[var(--sub-text-color)] ">شماره موبایل</span>
            <div className="font-semibold text-[var(--color-white)]">
              <span>{order?.person?.phoneNumber}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-x-2 items-center justify-between lg:justify-normal">
          <span className=" text-[var(--sub-text-color)] ">ادرس</span>
          <span className="font-semibold text-[var(--color-white)]">{order?.person?.addressLine}</span>
        </div>
      </div>

      <div className=" flex flex-col gap-y-10 p-5 border-b border-[var(--glass-border)] text-sm lg:text-base font-semibold">
        {/* order ovarall details */}
        <div className="flex lg:flex-row flex-col lg:gap-x-10 gap-y-3">
          <div className="flex gap-x-2 items-center justify-between">
            <span className=" text-[var(--sub-text-color)] ">مبلغ</span>
            <span className="font-semibold text-[var(--color-white)]">
              {" "}
              {formatNumber(order?.totalOrderPrice)} تومان
            </span>
          </div>
          {order?.totalOrderOffPrice ? (
            <div className="flex gap-x-2 items-center justify-between">
              <span className=" text-[var(--sub-text-color)] ">سود شما از خرید</span>
              <div className="flex gap-x-1 font-semibold text-[var(--color-white)]">
                {formatNumber(order?.totalOrderOffPrice)} تومان
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="border border-[var(--glass-border)] rounded-xl overflow-hidden">
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
