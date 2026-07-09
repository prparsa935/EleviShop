
import * as SliderPrimitive from "@radix-ui/react-slider";

const Slider = ({ className, ...props }) => {
  return (
    <SliderPrimitive.Root 
    

      className={
        "relative flex w-full touch-none select-none items-center " +
        className
      }
      {...props}
    >
      <SliderPrimitive.Track   className="relative h-2 w-full grow overflow-hidden bg-[var(--color-gray353030)] rounded-full">
        <SliderPrimitive.Range   className="absolute h-full bg-[var(--color-gold)]" />
       
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb   className="!block h-5 w-5 rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-white)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      <SliderPrimitive.Thumb  className="block h-5 w-5 rounded-full border-2 border-[var(--color-gold)] bg-[var(--color-white)] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
     
    </SliderPrimitive.Root>
  );
};
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
