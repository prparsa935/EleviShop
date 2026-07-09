import { useNavigate } from "react-router";
import { imageServerAddress } from "../../App";
import productImg from "../../assets/img/947920b7e5d1b87552bff471172eb45237b15a03_1660396852.jpg";
import { Carousel, CarouselContent, CarouselItem } from "../Carousel/Carousel";
import { formatNumber } from "../../utils/helperMehods";
import SmartImage from "../smartimage/SmartImage";
const OrderBox = ({ order }) => {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col glass glass-hover rounded-2xl cursor-pointer"
      onClick={() => {
        navigate("/profile/orders/" + order?.id);
      }}
    >
      {/* header */}
      <div className="flex flex-col border-b border-[var(--glass-border)]  ">
        <div className="flex justify-between items-center gap-y-2    m-4">
          <div className=" font-semibold text-[var(--color-white)]">
            <i class="fa-solid fa-check gold-text ml-1"></i>
            <span>{order?.orderStatus}</span>
          </div>
          <i class="fa-solid fa-angle-left cursor-pointer gold-text"></i>
        </div>

        <div className="flex lg:flex-row flex-col text-[var(--sub-text-color)] gap-x-4 gap-y-2 m-4 lg:text-sm  text-xs">
          <div className="flex gap-x-2 items-center">
            {formatNumber(order?.faDateCreated)}
          </div>
          <div className="flex gap-x-2 items-center lg:justify-normal justify-between ">
            <span>کد سفارش</span>
            <span className="text-[var(--color-white)]">
              {formatNumber(order?.trackingCode)}
            </span>
          </div>
          <div className="flex gap-x-2 items-center lg:justify-normal justify-between">
            <span>مبلغ</span>
            <div>
              <span className="text-[var(--color-white)]">{formatNumber(order?.totalOrderPrice)}</span>
              <span className="text-[var(--color-white)]">تومان</span>
            </div>
          </div>
          <div className="flex gap-x-2 items-center lg:justify-normal justify-between ">
            <span>تخفیف</span>
            <div className="">
              <span className="text-[var(--color-white)]">{formatNumber(order?.totalOrderOffPrice)}</span>
              <span className="text-[var(--color-white)]">تومان </span>
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
              <SmartImage
                className="w-[64px] h-[64px] rounded-lg object-cover"
                src={
                  imageServerAddress +
                  orderInventory?.inventory?.product?.mainImage?.filePath
                }
                alt={orderInventory?.inventory?.product?.name}
                ratio="1/1"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex p-4 gap-x-4">
      </div>
    </div>
  );
};
export default OrderBox;
