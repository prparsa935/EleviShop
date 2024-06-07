import imageTest1 from '../../assets/img/4fb1ba5a6b5d981ce357ddf1db20048ba2cd1587_1692516449.webp' 
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../Carousel/Carousel"
import Autoplay from "embla-carousel-autoplay"
const AdSlider=()=>{
    return(
            <Carousel
                  plugins={[
                    Autoplay({
                      delay: 2000,
                   
                     
                    }),
                  ]}
            opts={{direction:'rtl',loop:true}}
        
            className="w-full h-[268px] lg:h-[400px] relative "
            >
                <CarouselContent className={'h-100'}>
                    {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className={'basis-[70rem] md:basis-full '} >
                        <img className="h-100"  src={imageTest1}></img>
                        
                    </CarouselItem>
                    ))}
                   
                </CarouselContent>
                <CarouselPrevious moreCss={'absolute top-1/2  right-2'} shape={'rounded-full'} size="lg" bgColor={'bg-white'}   />
                <CarouselNext moreCss={'absolute top-1/2  left-2'} shape={'rounded-full'} size="lg" bgColor={'bg-white'}   />
            </Carousel>
    )
}
export default AdSlider