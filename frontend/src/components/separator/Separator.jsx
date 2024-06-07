"use client"
 
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
 

 
const Separator=( { className, orientation = "horizontal", decorative = true, ...props })=>
{
    return (
        <SeparatorPrimitive.Root

        decorative={decorative}
        orientation={orientation}
        className={"shrink-0 bg-border"+" "+(orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]")+' '+(className?className:'')}
        {...props}
        />
    )
      }
Separator.displayName = SeparatorPrimitive.Root.displayName
 
export default Separator 