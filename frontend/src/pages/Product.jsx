import CategoryPath from "../components/categorypath/CategoryPath";
import { useState } from "react";
import imageTest1 from "../assets/img/4fb1ba5a6b5d981ce357ddf1db20048ba2cd1587_1692516449.webp";

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
const Product = () => {
  const [imageSiderActive, setImageSiderActive] = useState(false);
  return (
    <div className="product-page">
      <NavBar />
      <ProductImageShow
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
        ></ProductUpperSection>
      </div>
    </div>
  );
};
export default Product;
