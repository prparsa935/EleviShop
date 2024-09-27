import CategoryPath from "../components/categorypath/CategoryPath";
import { useContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
// import product from '../jsons/product.json'

import NavBar from "../components/navbar/NavBar";

import ProductUpperSection from "../components/productuppersection/ProductUpperSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/Carousel/Carousel";
import ProductImageShow from "../components/productimageshow/ProductImageShow";

import ProductLowerSection from "../components/productlowersection/ProductLowerSection";
import { fetchSingleProduct } from "../api/productApi";
import PageLoading from "../components/pageloading/PageLoading";
import useDidUpdateEffect from "../hooks/useDidUpdateEffect";
import AuthContext from "../context/AuthContext";
const Product = () => {
  const { id } = useParams();
  const [imageSiderActive, setImageSiderActive] = useState(false);
  const { shoppingCart } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState();
  useEffect(() => {
    setLoading(true);
    fetchSingleProduct(id, setProduct, setLoading);
  }, [id]);
  useDidUpdateEffect(() => {
    let lastAvailableInv = null;
    const inventory = product?.inventories?.find((inventory) => {
      const productInCartIndex = shoppingCart.findIndex((productInCart) => {
        return productInCart.inventory.id === inventory.id;
      });
      console.log(inventory.quantity);
      if (inventory.quantity !== 0) {
        lastAvailableInv = inventory;
      }
      return productInCartIndex !== -1;
    });

    if (inventory) {
      setSelectedSize({
        label: inventory.size,
        value: inventory,
      });
    } else if (lastAvailableInv) {
      setSelectedSize({
        label: lastAvailableInv.size,
        value: lastAvailableInv,
      });
    } else {
      setSelectedSize({
        label: product?.inventories[0]?.size,
        value: product?.inventories[0],
      });
    }
  }, [product]);

  if (loading) {
    return <PageLoading></PageLoading>;
  }
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
        <CategoryPath categoryPath={product?.mainCategory?.categoryPath} />
        {/* unit product */}
        <ProductUpperSection
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
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
        <ProductLowerSection
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          product={product}
        ></ProductLowerSection>
      </div>
      <div className="h-[200px]"></div>
    </div>
  );
};
export default Product;
