import { imageServerAddress } from "../../App";
import slidebarImages from "../../jsons/slidebarimages.json";
import SmartImage from "../smartimage/SmartImage";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../Carousel/Carousel";
import Autoplay from "embla-carousel-autoplay";
const AdSlider = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      opts={{ direction: "rtl", loop: true }}
      className="w-full h-[268px] lg:h-[400px] relative "
    >
      <CarouselContent className={"h-100"}>
        {slidebarImages?.map((src,index) => (
          <CarouselItem
            key={index}
            className={"basis-[60rem] md:basis-full flex justify-center "}
          >
            <SmartImage
              className="h-100 self-center"
              src={imageServerAddress + src}
              alt=""
              eager={index === 0}
              ratio="16/5"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        moreCss={"absolute top-1/2  right-2"}
        shape={"rounded-full"}
        size="lg"
        bgColor={"bg-[var(--glass-bg-strong)]"}
      />
      <CarouselNext
        moreCss={"absolute top-1/2  left-2"}
        shape={"rounded-full"}
        size="lg"
        bgColor={"bg-[var(--glass-bg-strong)]"}
      />
    </Carousel>
  );
};
export default AdSlider;
