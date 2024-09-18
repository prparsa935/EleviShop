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
import { fetchRelatedProducts } from "../../api/productApi";
import { imageServerAddress } from "../../App";
import { useNavigate } from "react-router";

const HorizentalProductList = ({ product }) => {
  const [relatedProducts, setRelatedProducts] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    fetchRelatedProducts(product?.id, product?.code, setRelatedProducts)

  }, [product])

  return (
    <div className=" w-100 ">
      <Carousel
        opts={{ direction: "rtl", dragFree: true }}
        className=" w-full border p-5   "
      >
        <span className=" font-medium text-lg">محصولات مرتبط</span>
        <CarouselContent className={" h-100 py-4 pr-4"}>
          {relatedProducts?.map((relatedProduct, index) => (
            <CarouselItem
              onClick={() => {
                navigate('/product/' + relatedProduct?.id)

              }}
              key={index}
              className={
                " p-3  flex flex-col gap-y-2 bg-white cursor-pointer"


              }
            >
              <div className={"  mx-auto"}>
                <img className="w-[114px] h-[114px] md:w-[150px] md:h-[150px]" src={imageServerAddress + relatedProduct?.mainImage?.filePath}></img>
              </div>
              <div className="w-[114px]  md:w-[132px] h-[42px] overflow-hidden text-xs text-slate-500 font-semibold">
                {relatedProduct.name}
              </div>
              <div className="flex justify-between items-center mb-3">
                <Tag
                  bgColor="bg-red-600"
                  txtColor="text-white"
                  morCss="text-sm font-basic"
                  size="xs"
                >
                  ۸۴٪
                </Tag>
                <div className=" font-bold text-xs">۲۳.۸۱۰ تومان</div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
export default HorizentalProductList;
