import Tag from "../tag/Tag";
import { Carousel, CarouselContent, CarouselItem } from "../Carousel/Carousel";

import { imageServerAddress } from "../../App";
import { useNavigate } from "react-router";
import {
  formatNumber,
  transformToPersianNumber,
} from "../../utils/helperMehods";
import { useEffect } from "react";

const HorizentalProductList = ({ products, title }) => {
  const navigate = useNavigate();

  return (
    <div className=" w-100 ">
      <Carousel
        opts={{ direction: "rtl", dragFree: true }}
        className="w-full border border-[var(--border-color)] rounded-2xl p-5 bg-[var(--color-productcolor)]"
      >
        <span className="font-semibold text-lg text-[var(--color-white)]">
          {title}
        </span>
        <CarouselContent className={"h-100 py-4 pr-4"}>
          {products?.map((relatedProduct, index) => (
            <CarouselItem
              onClick={() => {
                navigate("/product/" + relatedProduct?.id);
              }}
              key={index}
              className={
                "p-3 flex flex-col gap-y-2 bg-[var(--tp-b-color)] rounded-xl border border-[var(--color-bordercolorwhite)] cursor-pointer hover:border-[var(--bf-green)] transition-colors"
              }
            >
              <div className={"mx-auto"}>
                <img
                  className="w-[114px] h-[114px] md:w-[150px] md:h-[150px] object-cover rounded-lg"
                  src={imageServerAddress + relatedProduct?.mainImage?.filePath}
                ></img>
              </div>
              <div className="w-[114px] md:w-[132px] h-[42px] overflow-hidden text-xs text-[var(--sub-text-color)] font-semibold">
                {relatedProduct?.name}
              </div>
              <div className="flex justify-between items-center mb-3">
                {relatedProduct?.offPercent ? (
                  <Tag
                    bgColor="bg-[var(--bf-red)]"
                    txtColor="text-white"
                    morCss="text-sm font-basic"
                    size="xs"
                  >
                    {formatNumber(relatedProduct?.offPercent) + "٪"}
                  </Tag>
                ) : (
                  <></>
                )}

                <div className="font-bold text-xs text-[var(--color-white)]">
                  {formatNumber(relatedProduct?.inventories?.[0]?.price)} تومان
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
export default HorizentalProductList;