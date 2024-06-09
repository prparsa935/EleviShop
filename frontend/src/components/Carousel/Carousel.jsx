

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Button from '../Button/Button'



const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel=(  
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    }
  
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
      
          onKeyDownCapture={handleKeyDown}
          className={"relative"+" "+ className}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }










Carousel.displayName = "Carousel"

const CarouselContent =({ className, ...props }) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden h-100">
      <div
    
        className={
          "flex"+" "+(orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col")+" "+className
        }
        {...props}
      />
    </div>
  )
}
CarouselContent.displayName = "CarouselContent"

const CarouselItem = ({ className, ...props }) => {
  const { orientation } = useCarousel()

  return (
    <div

      role="group"
      aria-roledescription="slide"
      className={
        "min-w-0 shrink-0 grow-0 "+" "+(orientation === "horizontal" ? "ml-1" : "mt-1")+" "+className}
      {...props}
    />
  )
}
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = ({ moreCss,shape, size ,bgColor,txtColor , ...props }) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
    bgColor={bgColor}
    txtColor={txtColor}
    shape={shape}
    size={size}
    moreCss={moreCss}

    disabled={!canScrollPrev}
    onClick={scrollPrev}
    {...props}
  >
    <i class="fa-solid  fa-angle-right w-4 h-4"></i>
    <span className="sr-only">Next slide</span>
  </Button>

  )
}
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = ({shape,moreCss,size,bgColor,txtColor ,...props }) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
    bgColor={bgColor}
    txtColor={txtColor}
    shape={shape}
    size={size}
    moreCss={moreCss}
    disabled={!canScrollNext}
    onClick={scrollNext}

    {...props}
  >
    <i class="fa-solid fa-angle-left w-4 h-4"></i>
    <span className="sr-only">Previous slide</span>
  </Button>

  )
}
CarouselNext.displayName = "CarouselNext"

export {
  
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
