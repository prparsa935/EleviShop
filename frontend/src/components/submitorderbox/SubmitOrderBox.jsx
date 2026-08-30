import { useContext, useState } from "react";
import Button from "../Button/Button";
import AuthContext from "../../context/AuthContext";
import formApiHandler from "../../api/form";
import { formatNumber } from "../../utils/helperMehods";
import { useNavigate } from "react-router";
import { trackEvent } from "../../hooks/useAnalytics";

const SubmitOrderBox = ({ price, setToastList }) => {
  const { shoppingCart, setShoppingCart } = useContext(AuthContext);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const submitOrder = async () => {
    const orderData = shoppingCart
      .map((item) => {
        if (item?.itemType === "SET") {
          return {
            itemType: "SET",
            productSetId: item?.product?.id,
            colorId: item?.color?.id,
            quantity: item?.quantity,
          };
        }
        return {
          itemType: "SIMPLE",
          inventory: { id: item?.inventory?.id },
          quantity: item?.quantity,
        };
      })
      .filter(
        (item) =>
          item.itemType === "SET"
            ? item.productSetId && item.colorId
            : item.inventory?.id
      );
    const success = await formApiHandler("order/save", orderData, setToastList, setErrors, setLoading);
    if (success) {
      trackEvent("PURCHASE_COMPLETE", {
        metadata: {
          totalPrice: price?.totalPrice,
          itemCount: shoppingCart.length,
        },
      });
      setShoppingCart([]);
      navigate("/profile/orders");
    }
  };
  return (
    <div className="glass-strong lg:w-[300px] w-screen left-0 justify-between items-center lg:items-stretch fixed bottom-0 flex lg:flex-col gap-y-4 border border-[var(--glass-border)] p-5 lg:sticky lg:top-[155px]">
      <div className="lg:flex   hidden justify-between text-[var(--sub-text-color)] font-semibold border-b-2 border-[var(--glass-border)] py-3  ">
        <span>قیمت کالا ها </span>
        <div>
          <span className="ml-1">{formatNumber(price?.totalPurePrice)}</span>
          <span>تومان</span>
        </div>
      </div>
      <div className="lg:flex hidden justify-between  items-center  font-semibold  border-b-2 border-[var(--glass-border)] py-3   ">
        <span>هزینه ارسال</span>
        <div>
          <span className="ml-1">{formatNumber(49000)}</span>
          <span>تومان</span>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col justify-between items-center lg:order-none order-2  font-semibold border-b-2 border-[var(--glass-border)] text-[var(--sub-text-color)] py-3    ">
        <span>قابل پرداخت</span>
        <div className="text-[var(--color-white)]">
          <span className="ml-1">
            {formatNumber(price?.totalPrice + 49000)}
          </span>
          <span>تومان</span>
        </div>
      </div>
      <Button
        onClick={submitOrder}
        size="lg"
        shape="rounded-xl"
        txtColor="text-[var(--color-gold)]"
        moreCss="border-[var(--color-gold)]"
      >
        تایید و تکمیل سفارش
      </Button>
    </div>
  );
};
export default SubmitOrderBox;
