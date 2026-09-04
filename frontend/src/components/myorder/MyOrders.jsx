import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import returnedOrderImg from "../../assets/img/status-returned.svg";
import deliveredOrderImg from "../../assets/img/status-delivered.svg";
import processingOrderImg from "../../assets/img/status-processing.svg";
import SmartImage from "../smartimage/SmartImage";
import { getOrdersCounts } from "../../api/order";
import { transformToPersianNumber } from "../../utils/helperMehods";

const MyOrders = ({ setToastList }) => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    getOrdersCounts(setCounts, setToastList);
  }, []);

  const orderStats = [
    {
      img: processingOrderImg,
      count: counts?.current,
      label: "جاری",
      state: "current",
    },
    {
      img: deliveredOrderImg,
      count: counts?.delivered,
      label: "تحویل شده",
      state: "delivered",
    },
    {
      img: returnedOrderImg,
      count: counts?.canceled,
      label: "مرجوع شده",
      state: "canceled",
    },
  ];

  return (
    <div className="flex flex-col glass p-4 rounded-2xl ">
      <div className="flex justify-between items-center ">
        <span className=" font-semibold lg:text-lg text-[var(--color-white)]">سفارش های من</span>
        <div
          onClick={() => navigate("/profile/orders")}
          className="gold-text text-sm cursor-pointer"
        >
          <span>مشاهده همه</span>
          <i class="fa-solid fa-angle-left mr-2"></i>
        </div>
      </div>

      <div className="flex justify-around mt-10">
        {orderStats.map((stat) => (
          <div
            key={stat.state}
            onClick={() => navigate("/profile/orders")}
            className="flex flex-col lg:flex-row cursor-pointer"
          >
            <SmartImage src={stat.img} alt="" ratio="1/1" />
            <div className="flex flex-col justify-between mr-2">
              <div className="lg:text-lg font-semibold text-[var(--color-white)]">
                <span className="ml-1">
                  {transformToPersianNumber(String(stat.count ?? 0))}
                </span>
                <span>سفارش</span>
              </div>
              <span className=" text-sm text-[var(--sub-text-color)]">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyOrders
