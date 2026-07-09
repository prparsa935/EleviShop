import { imageServerAddress } from "../../App";
import SmartImage from "../smartimage/SmartImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../Carousel/Carousel";

const ProductImageShow = ({ active, setActive, productImageList }) => {
  return (
    <div
      data-active={active}
      className=" fixed top-0 w-full h-screen bg-[var(--color-lightblack)] z-50 data-[active=false]:hidden"
    >
      <div className="relative flex items-center w-full h-100">
          <div
            onClick={() => setActive(false)}
            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full glass text-[var(--color-white)] cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-x"></i>
          </div>
        <Carousel opts={{ direction: "rtl" }} className="md:h-[70vh] md:w-[70vh] w-100 m-auto relative ">
          <CarouselContent className={"h-100"}>
            {productImageList?.map((image, index) => (
              <CarouselItem key={index} className={"basis-full "}>
                <SmartImage className="h-100 w-100 rounded-xl object-contain" src={imageServerAddress + image?.filePath} alt="" />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious moreCss={"absolute top-1/2 right-2"} shape={"rounded-full"} size="lg" bgColor={"bg-[var(--glass-bg-strong)]"} />
          <CarouselNext moreCss={"absolute top-1/2 left-2"} shape={"rounded-full"} size="lg" bgColor={"bg-[var(--glass-bg-strong)]"} />
        </Carousel>
      </div>
    </div>
  );
};
export default ProductImageShow;