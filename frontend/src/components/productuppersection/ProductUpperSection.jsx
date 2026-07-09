import { useEffect, useState } from "react";
import Button from "../Button/Button";
import AddToCart from "../addtocart/AddToCart";
import { imageServerAddress } from "../../App";
import SmartImage from "../smartimage/SmartImage";
import schema from "../../schema/schema";

const ProductUpperSection = ({ setImageSiderActive, product, selectedSize, setSelectedSize }) => {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row justify-between glass rounded-3xl p-4">
      <div className="lg:w-6/12 w-100 flex flex-col gap-y-3 lg:px-4">
        {product?.offPercent >= 25 ? (
          <div className="w-fit px-4 py-1.5 rounded-full bg-[var(--bf-lighter-red)] text-[var(--bf-red)] text-sm font-semibold order-3 lg:order-1 ">
            فروش ویژه
          </div>
        ) : (
          <></>
        )}

        <div className="flex flex-col lg:flex-row gap-y-4 mt-3 order-1 lg:order-2">
          <div className="flex lg:flex-col px-3 text-lg lg:w-14 lg:gap-y-5 gap-x-5 text-[var(--sub-text-color)]">
            {liked ? (
              <i className="fa-solid fa-heart text-[var(--bf-red)]"></i>
            ) : (
              <i className="fa-regular fa-heart"></i>
            )}
            <i className="fa-light fa-share-nodes"></i>
            <i className="fa-regular fa-bell"></i>
          </div>
           <div className="mx-auto ">
             <SmartImage
               className="h-[250px] lg:h-auto rounded-2xl"
               src={imageServerAddress + product?.mainImage.filePath}
               alt={product?.name}
               eager
               ratio="1/1"
             />
           </div>
        </div>

        <div className="lg:order-3 order-2 flex flex-wrap gap-2">
          {product?.images?.map((image, index) => (
            <SmartImage
              key={index}
              onClick={() => setImageSiderActive(true)}
              className="w-[72px] h-[72px] object-cover rounded-xl border-2 border-[var(--glass-border)] p-1 cursor-pointer hover:border-[var(--color-gold)] transition-colors"
              src={imageServerAddress + image.filePath}
              alt=""
              ratio="1/1"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col w-100">
        <div className="p-3">
          <p className="font-semibold sm:text-xl text-base text-[var(--color-white)]">
            {product?.name}
          </p>
        </div>
        <div className="flex lg:flex-row flex-col w-100">
          <div className="grow flex flex-col gap-y-4 mt-2 border-t border-[var(--glass-border)] pt-3 mx-5 ">
            <div className="flex items-center text-xs ">
              <div className="gap-x-1 flex items-center ml-3 ">
                <i className="fa-solid fa-star text-[var(--color-yellow)]"></i>
                <span className="font-medium text-[var(--color-white)]">{product?.rate}</span>
                <span className="text-[var(--sub-text-color)]">(امتیاز)</span>
              </div>
              <div className="gap-x-1 flex items-center text-xs ">
                <span className="text-[var(--bf-sky)]">{product?.commentCount} دیدگاه</span>
                </div>
            </div>

            <div className="flex flex-col mt-10 ">
              <h3 className="text-xl mb-3 font-semibold text-[var(--color-white)]">ویژگی ها</h3>
              <div className="grid grid-cols-3">
                {schema[product?.type]?.map((attr, i) => (
                  <div key={i} className="p-3 flex flex-col glass rounded-2xl m-1 text-sm">
                    <h5 className="text-[var(--sub-text-color)]">{attr.value}</h5>
                    <p className="text-[var(--color-white)] font-medium">{product?.[attr.key]}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="bg-[var(--glass-border)] h-[1px] grow"></div>
                <Button
                  size="sm"
                  bgColor="bg-transparent"
                  txtColor="text-[var(--color-gold)]"
                  moreCss="w-98 mx-5"
                  leftIcon={<i className="fa-solid fa-angle-left"></i>}
                >
                  مشاهده همه ویژگی ها
                </Button>
                <div className="bg-[var(--glass-border)] h-[1px] grow"></div>
              </div>
            </div>
          </div>
          <AddToCart inventory={selectedSize?.value} product={product} />
        </div>
      </div>
    </div>
  );
};
export default ProductUpperSection;