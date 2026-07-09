"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"



const Switch =({className,thumbclassName,...props}) => {
    return(
        <SwitchPrimitives.Root
        className={"  peer inline-flex h-5 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-[var(--glass-border)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 glass data-[state=checked]:bg-[var(--color-gold)] data-[state=checked]:border-[var(--color-gold)] " +className}
        {...props}
        
      >
        <SwitchPrimitives.Thumb
          className={"  flex-row-reverse pointer-events-none block h-3 w-3 rounded-full bg-[var(--color-white)] shadow-lg ring-0 transition-transform data-[state=checked]:-translate-x-6 data-[state=unchecked]:-translate-x-1 data-[state=unchecked]:bg-[var(--sub-text-color)] data-[state=checked]:bg-white  "+ thumbclassName }
        />
      </SwitchPrimitives.Root>

    )

}
Switch.displayName = SwitchPrimitives.Root.displayName

export default  Switch 
