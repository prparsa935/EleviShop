import productImageTest from "../../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../Carousel/Carousel";
const ProductImageShow = ({active,setActive}) => {
  return (
    <div data-active={active} className="  absolute top-0 w-full h-screen bg-black  z-50 data-[active=false]:hidden">
      <div className="relative flex items-center w-full h-100">
        <div onClick={()=>{
            setActive(false)
            
        }} className=" absolute top-4 left-4 text-white cursor-pointer">
          <i class="fa-solid fa-x"></i>
        </div>
        <Carousel
          opts={{ direction: "rtl" }}
          className="md:h-[70vh] md:w-[70vh] w-100 m-auto  relative "
        >
          <CarouselContent className={"h-100"}>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} className={"basis-full "}>
                <img className="h-100 w-100" src={productImageTest}></img>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            moreCss={"absolute top-1/2  right-2"}
            shape={"rounded-full"}
            size="lg"
            bgColor={"bg-white"}
          />
          <CarouselNext
            moreCss={"absolute top-1/2  left-2"}
            shape={"rounded-full"}
            size="lg"
            bgColor={"bg-white"}
          />
        </Carousel>
      </div>
    </div>
  );
};
export default ProductImageShow;
