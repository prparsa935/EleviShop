import Tag from "../tag/Tag";
import { Carousel, CarouselContent, CarouselItem } from "../Carousel/Carousel";

import { imageServerAddress } from "../../App";
import { useNavigate } from "react-router";
import {
  formatNumber,
  transformToPersianNumber,
} from "../../utils/helperMehods";

const HorizentalProductList = ({ products, title }) => {
  const navigate = useNavigate();
  console.log(products);
  return (
    <div className=" w-100 ">
      <Carousel
        opts={{ direction: "rtl", dragFree: true }}
        className=" w-full border p-5   "
      >
        <span className=" font-medium text-lg">{title}</span>
        <CarouselContent className={" h-100 py-4 pr-4"}>
          {products?.map((relatedProduct, index) => (
            <CarouselItem
              onClick={() => {
                navigate("/product/" + relatedProduct?.id);
              }}
              key={index}
              className={" p-3  flex flex-col gap-y-2 bg-white cursor-pointer"}
            >
              <div className={"  mx-auto"}>
                <img
                  className="w-[114px] h-[114px] md:w-[150px] md:h-[150px]"
                  src={imageServerAddress + relatedProduct?.mainImage?.filePath}
                ></img>
              </div>
              <div className="w-[114px]  md:w-[132px] h-[42px] overflow-hidden text-xs text-slate-500 font-semibold">
                {relatedProduct?.name}
              </div>
              <div className="flex justify-between items-center mb-3">
                <Tag
                  bgColor="bg-red-600"
                  txtColor="text-white"
                  morCss="text-sm font-basic"
                  size="xs"
                >
                  {formatNumber(relatedProduct?.offPercent) + "٪"}
                </Tag>
                <div className=" font-bold text-xs">
                  {" "}
                  {formatNumber(relatedProduct?.price)} تومان
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
