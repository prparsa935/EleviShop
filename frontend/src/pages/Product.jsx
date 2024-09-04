import CategoryPath from "../components/categorypath/CategoryPath";
import { useEffect, useState } from "react";
import imageTest1 from "../assets/img/4fb1ba5a6b5d981ce357ddf1db20048ba2cd1587_1692516449.webp";
import { useParams } from "react-router-dom";
// import product from '../jsons/product.json'
import Button from "../components/Button/Button";
import Separator from "../components/separator/Separator";
import NavBar from "../components/navbar/NavBar";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import AddToCart from "../components/addtocart/AddToCart";
import ProductUpperSection from "../components/productuppersection/ProductUpperSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/Carousel/Carousel";
import ProductImageShow from "../components/productimageshow/ProductImageShow";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/tab/Tab";
import ProductLowerSection from "../components/productlowersection/ProductLowerSection";
import { fetchSingleProduct } from "../api/productApi";
const Product = () => {
  const { id } = useParams();
  const [imageSiderActive, setImageSiderActive] = useState(false);

  const [product, setProduct] = useState(null);
  useEffect(() => {
    fetchSingleProduct(id, setProduct);
  }, []);

  return (
    <div className="product-page">
      <NavBar />
      <ProductImageShow
        productImageList={product?.images}
        active={imageSiderActive}
        setActive={setImageSiderActive}
      ></ProductImageShow>
      <div className="flex flex-col gap-y-5  mt-7 mx-auto max-w-screen-2xl">
        {/* category path */}
        <CategoryPath />
        {/* unit product */}
        <ProductUpperSection
          imageSiderActive={imageSiderActive}
          setImageSiderActive={setImageSiderActive}
          product={product}
        ></ProductUpperSection>

        <Carousel
          opts={{ direction: "rtl", dragFree: true }}
          className=" w-100 h-12 m-auto  relative my-5 select-none cursor-pointer shadow-lg shadow-slate-200 "
        >
          <CarouselContent className={"h-100 justify-center align-baseline "}>
            <CarouselItem className={" lg:basis-1/5 basis-1/3    "}>
              <div className="flex justify-center text-slate-400 lg:text-sm text-xs flex-col lg:flex-row  font-medium items-center gap-x-2">
                <i class="far fa-xl fa-shipping-fast mb-4 lg:m-0  "></i>

                <span>امکان تحویل سریع</span>
              </div>
            </CarouselItem>
            <CarouselItem className={" lg:basis-1/5 basis-1/3  "}>
              <div className="flex justify-center text-slate-400 lg:text-sm text-xs flex-col lg:flex-row  font-medium items-center gap-x-2">
                <i class="fa-solid fa-xl  fa-user-headset mb-4 lg:m-0"></i>
                <span>پشتیبانی ۲۴ ساعته</span>
              </div>
            </CarouselItem>
            <CarouselItem className={" lg:basis-1/5 basis-1/3  "}>
              <div className="flex justify-center text-slate-400 lg:text-sm text-xs flex-col lg:flex-row  font-medium items-center gap-x-2">
                <i class="fa-solid fa-xl fa-credit-card mb-4 lg:m-0"></i>

                <span>امکان تحویل درب منزل</span>
              </div>
            </CarouselItem>
            <CarouselItem className={" lg:basis-1/5 basis-1/3  "}>
              <div className="flex justify-center text-slate-400 lg:text-sm text-xs flex-col lg:flex-row  font-medium items-center gap-x-2">
                <i class="fa-solid fa-xl fa-repeat mb-4 lg:m-0"></i>
                <span>هفت روز ضمانت بازگشت</span>
              </div>
            </CarouselItem>

            <CarouselItem className={" lg:basis-1/5 basis-1/3  "}>
              <div className="flex justify-center text-slate-400 lg:text-sm text-xs flex-col lg:flex-row  font-medium items-center gap-x-2">
                <i class="fa-solid fa-xl fa-badge-check mb-4 lg:m-0"></i>
                <span>ضمانت اصل بودن کالا</span>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        <ProductLowerSection></ProductLowerSection>
      </div>
    </div>
  );
};
export default Product;
