"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"



const Switch =(props) => {
    return(
        <SwitchPrimitives.Root
        className={" bg-black peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50  " +props.className}
        
      
      >
        <SwitchPrimitives.Thumb
          className={"  flex-row-reverse pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:-translate-x-5 data-[state=unchecked]:translate-x-0  bg-black "+ props.circleCss }
        />
      </SwitchPrimitives.Root>

    )

}
Switch.displayName = SwitchPrimitives.Root.displayName

export default  Switch 
