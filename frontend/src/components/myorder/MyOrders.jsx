import returnedOrderImg from "../../assets/img/status-returned.svg";
import deliveredOrderImg from "../../assets/img/status-delivered.svg";
import processingOrderImg from "../../assets/img/status-processing.svg";
const MyOrders = () => {
  return (
    <div className="flex flex-col glass p-4 rounded-2xl ">
      <div className="flex justify-between items-center ">
        <span className=" font-semibold lg:text-lg text-[var(--color-white)]">سفارش های من</span>
        <div className="gold-text text-sm cursor-pointer">
          <span>مشاهده همه</span>
          <i class="fa-solid fa-angle-left mr-2"></i>
        </div>
      </div>

      <div className="flex justify-around mt-10">
        <div className="flex flex-col lg:flex-row">
          <img src={processingOrderImg}></img>
          <div className="flex flex-col justify-between mr-2">
            <div className="lg:text-lg font-semibold text-[var(--color-white)]">
              <span className="ml-1">۰</span>
              <span>سفارش</span>
            </div>
            <span className=" text-sm text-[var(--sub-text-color)]">جاری</span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <img src={deliveredOrderImg}></img>
          <div className="flex flex-col justify-between mr-2">
            <div className="lg:text-lg font-semibold text-[var(--color-white)]">
              <span className="ml-1">۰</span>
              <span>سفارش</span>
            </div>
            <span className=" text-sm text-[var(--sub-text-color)]">تحویل شده</span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <img src={returnedOrderImg}></img>
          <div className="flex flex-col justify-between mr-2">
            <div className="lg:text-lg font-semibold text-[var(--color-white)]">
              <span className="ml-1">۰</span>
              <span>سفارش</span>
            </div>
            <span className=" text-sm text-[var(--sub-text-color)]">مرجوع شده</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyOrders
