import returnedOrderImg from "../../assets/img/status-returned.svg";
import deliveredOrderImg from "../../assets/img/status-delivered.svg";
import processingOrderImg from "../../assets/img/status-processing.svg";
const MyOrders = () => {
  return (
    <div className="flex flex-col border p-4  ">
      <div className="flex justify-between items-center ">
        <span className=" font-semibold lg:text-lg">سفارش های من</span>
        <div className="text-sky-500 text-sm">
          <span>مشاهده همه</span>
          <i class="fa-solid fa-angle-left mr-2"></i>
        </div>
      </div>

      <div className="flex justify-around mt-10">
        <div className="flex flex-col lg:flex-row">
          <img src={processingOrderImg}></img>
          <div className="flex flex-col justify-between mr-2">
            <div className="lg:text-lg font-semibold ">
              <span className="ml-1">۰</span>
              <span>سفارش</span>
            </div>
            <span className=" text-sm ">جاری</span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <img src={deliveredOrderImg}></img>
          <div className="flex flex-col justify-between mr-2">
            <div className="lg:text-lg font-semibold ">
              <span className="ml-1">۰</span>
              <span>سفارش</span>
            </div>
            <span className=" text-sm ">تحویل شده</span>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row">
          <img src={returnedOrderImg}></img>
          <div className="flex flex-col justify-between mr-2">
            <div className="lg:text-lg font-semibold ">
              <span className="ml-1">۰</span>
              <span>سفارش</span>
            </div>
            <span className=" text-sm ">مرجوع شده</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyOrders
