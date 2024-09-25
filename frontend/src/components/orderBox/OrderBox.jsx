import { useNavigate } from "react-router";
import { imageServerAddress } from "../../App";
import productImg from "../../assets/img/947920b7e5d1b87552bff471172eb45237b15a03_1660396852.jpg";
import { Carousel, CarouselContent, CarouselItem } from "../Carousel/Carousel";
const OrderBox = ({ order }) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col border cursor-pointer"
      onClick={() => {
        navigate("/profile/orders/" + order?.id);
      }}
    >
      {/* header */}
      <div className="flex flex-col border-b  ">
        <div className="flex justify-between items-center gap-y-2    m-4">
          <div className=" font-semibold">
            <i class="fa-solid fa-check text-green-400 ml-1"></i>
            <span>{order?.orderStatus}</span>
          </div>
          <i class="fa-solid fa-angle-left cursor-pointer"></i>
        </div>

        <div className="flex lg:flex-row flex-col text-neutral-400 gap-x-4 gap-y-2 m-4 lg:text-sm  text-xs">
          <div className="flex gap-x-2 items-center">
            {order?.faDateCreated}
          </div>
          <div className="flex gap-x-2 items-center lg:justify-normal justify-between ">
            <span>کد سفارش</span>
            <span className="text-black">{order?.trackingCode}</span>
          </div>
          <div className="flex gap-x-2 items-center lg:justify-normal justify-between">
            <span>مبلغ</span>
            <div>
              <span className="text-black">{order?.totalOrderPrice}</span>
              <span className="text-black">تومان</span>
            </div>
          </div>
          <div className="flex gap-x-2 items-center lg:justify-normal justify-between ">
            <span>تخفیف</span>
            <div>
              <span className="text-black">{order?.totalOrderOffPrice}</span>
              <span className="text-black">تومان</span>
            </div>
          </div>
        </div>
      </div>

      <Carousel
        opts={{ direction: "rtl", dragFree: true }}
        className=" w-full   "
      >
        <CarouselContent className={" h-100 py-4 pr-4"}>
          {order?.orderInventories?.map((orderInventory, index) => (
            <CarouselItem key={index} className={" px-2  "}>
              <img
                className="w-[64px] h-[64px]"
                src={
                  imageServerAddress +
                  orderInventory?.inventory?.product?.mainImage?.filePath
                }
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex p-4 gap-x-4">
        {/* {order?.orderInventories?.map((orderInventory) => {
          return (
            <img
              className="w-[64px] h-[64px]"
              src={
                imageServerAddress +
                orderInventory?.inventory?.product?.mainImage?.filePath
              }
            />
          );
        })} */}
      </div>
    </div>
  );
};
export default OrderBox;
