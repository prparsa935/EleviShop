import { imageServerAddress } from "../../App";
import productImg from "../../assets/img/947920b7e5d1b87552bff471172eb45237b15a03_1660396852.jpg";
const OrderBox = ({ order }) => {
  return (
    <div className="flex flex-col border">
      {/* header */}
      <div className="flex flex-col border-b  ">
        <div className="flex justify-between items-center gap-y-2    m-4">
          <div className=" font-semibold">
            <i class="fa-solid fa-check text-green-400 ml-1"></i>
            <span>{order?.orderStatus}</span>
          </div>
          <i class="fa-solid fa-angle-left cursor-pointer"></i>
        </div>

        <div className="flex lg:flex-row flex-col text-neutral-400 gap-x-4 m-4">
          <div className="flex gap-x-2 items-center">
            {order?.getFaDateCreated}
          </div>
          <div className="flex gap-x-2 items-center ">
            <span>کد سفارش</span>
            <span className="text-black">{order?.trackingCode}</span>
          </div>
          <div className="flex gap-x-2 items-center">
            <span>مبلغ</span>
            <span className="text-black">{order?.getTotalOrderPrice}</span>
            <span className="text-black">تومان</span>
          </div>
          <div className="flex gap-x-2 items-center">
            <span>تخفیف</span>
            <span className="text-black">{order?.getTotalOrderOffPrice}</span>
            <span className="text-black">تومان</span>
          </div>
        </div>
      </div>
      <div className="flex p-4 gap-x-4">
        {order?.orderInventories?.map((orderInventory) => {
          return (
            <img
              className="w-[64px] h-[64px]"
              src={
                imageServerAddress +
                orderInventory?.inventory?.product?.mainImage?.filePath
              }
            />
          );
        })}
      </div>
    </div>
  );
};
export default OrderBox;
