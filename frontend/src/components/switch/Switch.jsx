"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"



const Switch =({className,thumbclassName,...props}) => {
    return(
        <SwitchPrimitives.Root
        className={"  peer inline-flex h-5 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-slate-300  transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-white data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 " +className}
        {...props}
      
      >
        <SwitchPrimitives.Thumb
          className={"  flex-row-reverse pointer-events-none block h-3 w-3 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:-translate-x-6 data-[state=unchecked]:-translate-x-1 data-[state=unchecked]:bg-slate-400 data-[state=checked]:bg-white  "+ thumbclassName }
        />
      </SwitchPrimitives.Root>

    )

}
Switch.displayName = SwitchPrimitives.Root.displayName

export default  Switch 
