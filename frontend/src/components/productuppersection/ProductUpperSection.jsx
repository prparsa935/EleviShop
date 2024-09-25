import { useEffect, useState } from "react";

import productImageTest from "../../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp";
import Button from "../Button/Button";
import AddToCart from "../addtocart/AddToCart";
import SelectBox from "../selectbox/SelectBox";
import { imageServerAddress } from "../../App";
const ProductUpperSection = ({
  setImageSiderActive,
  product,
  selectedSize,
  setSelectedSize,
}) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row justify-between">
      {/* right side */}
      <div className="lg:w-6/12 w-100 flex flex-col gap-y-3 lg:px-4">
        <div className="p-3 bg-rose-100 text-rose-600 text-base font-semibold order-3 lg:order-1 ">
          فروش ویژه
        </div>
        {/* main photo and stuff like favarite btn */}
        <div className="flex flex-col lg:flex-row gap-y-4 mt-3 order-1 lg:order-2">
          {/* favorite btn and ... */}
          <div className="flex lg:flex-col px-3 text-xl lg:w-14 lg:gap-y-5 gap-x-5 ">
            {liked ? (
              <i class="fa-solid fa-heart text-red-600"></i>
            ) : (
              <i class="fa-regular fa-heart"></i>
            )}
            <i class="fa-light fa-share-nodes"></i>
            <i class="fa-regular fa-bell"></i>
          </div>
          <div className="mx-auto ">
            <img
              className="h-[250px] lg:h-auto"
              src={imageServerAddress + product?.mainImage.filePath}
            ></img>
          </div>
        </div>
        {/* other photoes */}

        <div className="lg:order-3 order-2 flex   ">
          {product?.images?.map((image, index) => (
            <img
              onClick={() => {
                setImageSiderActive(true);
              }}
              className="ml-2 w-[72px] border-2 p-1 cursor-pointer "
              src={imageServerAddress + image.filePath}
            />
          ))}
        </div>
      </div>
      {/* (detail)leftside */}
      <div className="flex flex-col w-100">
        {/* title */}
        <div className="p-3  ">
          <p className=" font-medium  sm:text-xl text-base  ">
            {product?.name}
          </p>
        </div>
        {/* detail and add to cart */}
        <div className="flex lg:flex-row flex-col w-100">
          {/* detail */}
          <div className="grow flex flex-col gap-y-4  mt-2 border-t-1 pt-1 mx-5  ">
            {/* rate */}
            <div className="flex items-center text-xs   ">
              <div className="gap-x-1 flex items-center ml-3    ">
                <i class="fa-duotone fa-star text-amber-600"></i>
                <span className="">۴.۲</span>
                <span className=" text-slate-400 ">(امتیاز ۲۷ خریدار)</span>
              </div>
              <div className="gap-x-1 flex  items-center text-xs    ">
                <span className=" text-sky-400 ">18 دیدگاه</span>
              </div>
            </div>
            {/* size selection */}
            <div className="flex flex-col gap-y-3">
              <h3 className=" font-medium text-lg">
                <span className="">اندازه:</span>
                <span>{selectedSize?.label}</span>
              </h3>
              <div className=" w-40">
                <SelectBox
                  isClearable={false}
                  defaultValue={selectedSize}
                  isSearchable={false}
                  options={product?.inventories?.map((inventory) => ({
                    label: inventory.size,
                    value: inventory,
                  }))}
                  value={selectedSize}
                  onChange={setSelectedSize}
                ></SelectBox>
              </div>
            </div>
            {/* features */}
            <div className="flex flex-col ">
              <h3 className="text-xl mb-2">ویژگی ها</h3>
              {/* product feature card */}
              <div className="grid grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="p-3 flex flex-col bg-neutral-100 rounded-xl m-1 text-sm font-semidbold">
                    <h5 className=" text-slate-400  ">جنس</h5>
                    <p className="  text-neutral-700">پشم، پلی استر، نخ</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="bg-slate-300 h-[1px] grow"></div>
                <Button
                  size="sm"
                  moreCss="w-98 mx-5"
                  leftIcon={<i class="fa-solid fa-angle-left"></i>}
                >
                  مشاهده همه ویژگی ها
                </Button>
                <div className="bg-slate-300 h-[1px] grow"></div>
              </div>
            </div>
          </div>
          {/* add to cart */}
          <AddToCart inventory={selectedSize?.value} product={product} />
        </div>
      </div>
    </div>
  );
};
export default ProductUpperSection;
