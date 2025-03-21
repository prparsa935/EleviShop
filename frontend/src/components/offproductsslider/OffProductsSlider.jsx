import image from "../../assets/img/Amazings.svg";
import productImageTest from "../../assets/img/0a099b45d73a6607595ec7f1e39c5d3f1a08a2e6_1620035268.webp";
import Card from "../card/Card";
import Tag from "../tag/Tag";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../Carousel/Carousel";
import { useEffect, useState } from "react";
import { formatNumber } from "../../utils/helperMehods";
import { imageServerAddress } from "../../App";
import { useNavigate } from "react-router";
const OffProductsSlider = ({ offProducts }) => {
  const navigate=useNavigate()
  return (
    <div className=" mx-auto container max-w-screen-xl ">
      <Carousel
        opts={{ direction: "rtl", dragFree: true }}
        className=" w-full bg-rose-500  lg:rounded-2xl  "
      >
        <CarouselContent className={" h-100 py-4 pr-4"}>
          <CarouselItem
            className={"w-[114px] h-[114px] md:w-[132px] md:h-[132px] "}
          >
            <div className="">
              <img src={image}></img>
            </div>
          </CarouselItem>
          {offProducts?.map((product, index) => (
            <CarouselItem
              onClick={()=>navigate(`/product/${product?.id}`)}
              key={index}
              className={
                " p-3  flex flex-col gap-y-2 bg-white cursor-pointer" +
                " " +
                (index === 0 ? " rounded-r-2xl" : "")
              }
            >
              <div className={" w-[114px] h-[114px] md:w-[132px] md:h-[132px]"}>
                <img
                  src={imageServerAddress + product?.mainImage?.filePath}
                ></img>
              </div>
              <div className="w-[114px]  md:w-[132px] h-[42px] overflow-hidden text-xs text-slate-500 font-semibold">
                {product?.name}
              </div>
              <div className="flex justify-between items-center mb-3">
                <Tag
                  bgColor="bg-red-600"
                  txtColor="text-white"
                  morCss="text-sm font-basic"
                  size="xs"
                >
                  {formatNumber(product?.offPercent)}%
                </Tag>
                <div className=" font-bold text-xs">
                  {formatNumber(product?.price)} تومان
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
export default OffProductsSlider;
