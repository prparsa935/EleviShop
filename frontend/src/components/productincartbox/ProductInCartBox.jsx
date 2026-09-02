import { useContext, useState } from "react";

import specialSellImage from "../../assets/img/SpecialSell.png";

import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { imageServerAddress } from "../../App";
import { formatNumber } from "../../utils/helperMehods";
import SmartImage from "../smartimage/SmartImage";

const ProductInCartBox = ({ productInCart }) => {
  const navigate = useNavigate();
  const { sumProductInCart, subtractProductInCart, deleteCartItem } =
    useContext(AuthContext);
  const item = productInCart?.productInCart;
  const isSet = item?.itemType === "SET";
  const [showComponents, setShowComponents] = useState(false);
  const maxQuantity = isSet
    ? item?.availableQuantity
    : item?.inventory?.quantity;

  if (isSet) {
    return (
      <div className=" border-b border-[var(--glass-border)] px-1 py-5 cursor-pointer">
        <div className="flex">
          <div className="flex flex-col items-center">
            <SmartImage
              className="w-[114px] h-[114px] mb-3 rounded-xl"
              src={
                imageServerAddress + item?.product?.mainImage?.filePath
              }
              alt={item?.product?.name}
              ratio="1/1"
            />
            <SmartImage className="w-[60px] " src={specialSellImage} alt="" ratio="1/1" />
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="border border-[var(--glass-border)] rounded-md flex justify-between grow px-2 py-1 mt-4 gap-x-3 text-[var(--color-gold)] items-center cursor-pointer select-none "
            >
              {item?.quantity === maxQuantity ? (
                <div className="w-2"></div>
              ) : (
                <span
                  onClick={() => {
                    sumProductInCart(productInCart, maxQuantity);
                  }}
                >
                  +
                </span>
              )}

              <span>{formatNumber(item?.quantity)}</span>

              <span
                onClick={() => {
                  subtractProductInCart(productInCart);
                }}
              >
                -
              </span>
            </div>
            <span
              onClick={(e) => {
                e.stopPropagation();
                deleteCartItem(item);
              }}
              className="mt-3 text-xs text-[var(--bf-red)] cursor-pointer"
            >
              حذف
            </span>
          </div>
          <div className="flex flex-col mr-3 grow">
            <span className=" font-semibold mb-2 text-[var(--color-white)]">
              {item?.product?.name}
            </span>
            <div className="flex items-center gap-x-2 text-sm font-medium text-[var(--sub-text-color)]">
              <span>رنگ سرویس:</span>
              <span
                className="w-4 h-4 rounded-full border border-[var(--glass-border)] inline-block"
                style={{ backgroundColor: item?.color?.hexCode }}
              ></span>
              <span>{item?.color?.name}</span>
            </div>
            <div className="flex flex-col text-sm font-medium text-[var(--sub-text-color)] mt-1">
              <span>سرویس کامل (شامل تمام قطعات)</span>
              <span>ارسال تا دو هفته کاری</span>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowComponents((prev) => !prev);
              }}
              className="mt-3 flex items-center gap-x-2 text-xs text-[var(--color-gold)] cursor-pointer select-none w-fit"
            >
              <i
                className={`fa-solid fa-angle-${
                  showComponents ? "down" : "left"
                }`}
              ></i>
              <span>قطعات داخل این سرویس</span>
            </div>
            {showComponents ? (
              <div
                onClick={(e) => e.stopPropagation()}
                className="mt-2 flex flex-col gap-y-1 text-xs text-[var(--sub-text-color)] border border-[var(--glass-border)] rounded-xl p-3"
              >
                {(item?.setComponents || []).map((component, cIdx) => (
                  <div key={cIdx} className="flex justify-between gap-x-3">
                    <span>{component.plateName}</span>
                    <span>
                      {formatNumber(component.perSetQuantity)} عدد
                    </span>
                  </div>
                ))}
                {(item?.setComponents || []).length === 0 ? (
                  <span>قطعاتی ثبت نشده است</span>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <></>
            )}
            <div>
              <div className="gap-x-1 flex  text-xs text-[var(--bf-red)] mt-3 font-medium">
                <span>
                  {formatNumber(item?.product?.offPercent)}
                </span>
                <span>%</span>
                <span>تخفیف</span>
              </div>
              <div className=" flex text-lg gap-x-1  mt-3 font-semibold text-[var(--color-white)]">
                <span>{formatNumber(item?.price)}</span>
                <span>تومان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() =>
        navigate("/product/" + productInCart?.productInCart?.product?.id)
      }
      className=" border-b border-[var(--glass-border)] px-1 py-5 cursor-pointer"
    >
      <div className="flex">
        <div className="flex flex-col items-center">
          <SmartImage
            className="w-[114px] h-[114px] mb-3 rounded-xl"
            src={
              imageServerAddress +
              productInCart?.productInCart.product?.mainImage?.filePath
            }
            alt={productInCart?.productInCart?.product?.name}
            ratio="1/1"
          />
          <SmartImage className="w-[60px] " src={specialSellImage} alt="" ratio="1/1" />
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="border border-[var(--glass-border)] rounded-md flex justify-between grow px-2 py-1 mt-4 gap-x-3 text-[var(--color-gold)] items-center cursor-pointer select-none "
          >
            {productInCart?.productInCart?.quantity ===
            productInCart?.productInCart?.inventory?.quantity ? (
              <div className="w-2"></div>
            ) : (
              <span
                onClick={() => {
                  sumProductInCart(
                    productInCart,
                    productInCart?.productInCart?.inventory?.quantity
                  );
                }}
              >
                +
              </span>
            )}

            <span>{formatNumber(productInCart?.productInCart?.quantity)}</span>

            <span
              onClick={() => {
                subtractProductInCart(productInCart);
              }}
            >
              -
            </span>
          </div>
        </div>
          {/* left side (properties) */}
          <div className="flex flex-col mr-3">
            {/* title */}
            <span className=" font-semibold mb-2 text-[var(--color-white)]">
              {productInCart?.productInCart?.product?.name}
            </span>
            <div className="flex flex-col text-sm font-medium text-[var(--sub-text-color)]">
              <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
              <span>ارسال تا دو هفته کاری</span>
            </div>
            <div>
              <div className="gap-x-1 flex  text-xs text-[var(--bf-red)] mt-3 font-medium">
                <span>
                  {formatNumber(
                    productInCart?.productInCart?.product?.offPercent
                  )}
                </span>
                <span>%</span>
                <span>تخفیف</span>
              </div>
              <div className=" flex text-lg gap-x-1  mt-3 font-semibold text-[var(--color-white)]">
                <span>
                  {formatNumber(productInCart?.productInCart?.inventory?.price)}
                </span>
                <span>تومان</span>
              </div>
            </div>
          </div>
      </div>
      {/* انتقال به خرید بعدی */}
    </div>
  );
};
export default ProductInCartBox;
