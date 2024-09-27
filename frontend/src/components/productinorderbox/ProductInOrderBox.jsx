import { useNavigate } from "react-router";
import { imageServerAddress } from "../../App";
import { formatNumber } from "../../utils/helperMehods";

const ProductInOrderBox = ({ orderInventory }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate("/product/" + orderInventory?.inventory?.product?.id)
      }
      className=" border-b px-1 py-5 cursor-pointer"
    >
      <div className="flex">
        <div className="flex flex-col items-center">
          <img
            className="w-[114px] h-[114px] mb-3"
            src={
              imageServerAddress +
              orderInventory?.inventory?.product?.mainImage?.filePath
            }
          ></img>
          {/* <img className="w-[60px] " src={specialSellImage}></img> */}
          <span></span>
        </div>
        {/* left side (properties) */}
        <div className="flex flex-col mr-3">
          {/* title */}
          <span className=" font-semibold mb-2">
            {orderInventory?.inventory?.product?.name}
          </span>
          <div className="flex flex-col text-sm font-medium text-neutral-500">
            <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
            <span>سایز {orderInventory?.inventory?.size}</span>
            <div className="flex items-center gap-x-2">
              <span
                className=" w-5 h-5 rounded-full"
                style={{
                  backgroundColor:
                    orderInventory?.inventory?.product?.color?.hexCode,
                }}
              ></span>
              <span>{orderInventory?.inventory?.product?.color?.name}</span>
            </div>
          </div>
          <div>
            <div className="gap-x-1 flex  text-xs text-rose-600 mt-3 font-medium">
              <span>{formatNumber(orderInventory?.singleProductOffPercent)}</span>
              <span>%</span>
              <span>تخفیف</span>
            </div>
            <div className=" flex text-lg gap-x-1  mt-3 font-semibold">
              <span>{formatNumber(orderInventory?.singleProductPrice)}</span>
              <span>تومان</span>
            </div>
          </div>
        </div>
      </div>
      {/* انتقال به خرید بعدی */}
    </div>
  );
};
export default ProductInOrderBox;
