import { useContext, useEffect, useState } from "react";
import productImageTest from "../../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp";
import specialSellImage from "../../assets/img/SpecialSell.svg";
import { fetchSingleProduct } from "../../api/productApi";

import AuthContext from "../../context/AuthContext";
import useDidUpdateEffect from "../../hooks/useDidUpdateEffect";

const ProductInCartBox = ({ productInCart,key }) => {
 
  const {
    shoppingCart,
    findProductInCart,
    addToCart,
    sumProductInCart,
    subtractProductInCart,
    isProductInCartValid,
    deleteProductFromCart,
  } = useContext(AuthContext);
  

  return (
    <div className=" border-b px-1 py-5" key={key}>
      <div className="flex">
        <div className="flex flex-col items-center">
          <img
            className="w-[114px] h-[114px] mb-3"
            src={productInCart?.productInCart.product?.mainImage?.filePath}
          ></img>
          <img className="w-[60px] " src={specialSellImage}></img>
          <div className="border rounded-md flex justify-between grow px-2 py-1 mt-4 gap-x-3 text-red-500 items-center cursor-pointer select-none ">
            <span
              onClick={() => {
                sumProductInCart(productInCart, productInCart?.productInCart.inventory.quantity);
              }}
            >
              +
            </span>

            <span>{productInCart?.productInCart?.quantity}</span>

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
          <span className=" font-semibold mb-2">
            {productInCart?.productInCart.product?.name}
          </span>
          <div className="flex flex-col text-sm font-medium text-neutral-500">
            <span>گارانتی اصالت و سلامت فیزیکی کالا</span>
            <span>سایز {productInCart?.productInCart.inventory?.size}</span>
            <span>ارسال دیجی‌کالا از ۲ روز کاری دیگر</span>
          </div>
          <div>
            <div className="gap-x-1 flex  text-xs text-rose-600 mt-3 font-medium">
              <span>{productInCart?.productInCart.product?.offPercent}</span>
              <span>%</span>
              <span>تخفیف</span>
            </div>
            <div className=" flex text-lg gap-x-1  mt-3 font-semibold">
              <span>{productInCart?.productInCart.product?.price}</span>
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
