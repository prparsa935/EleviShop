
import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
 

 
const Tabs = TabsPrimitive.Root
 
const TabsList =({ className, ...props }) => {
  return(
    <TabsPrimitive.List
   
    className={
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground bg-slate-100 "+className
    }
    {...props}
  />

  )

    }
TabsList.displayName = TabsPrimitive.List.displayName
 
const TabsTrigger =({ className, ...props }) => {

  return(
      <TabsPrimitive.Trigger
 
      className={
        "inline-flex items-center justify-center whitespace-nowrap text-slate-600 rounded-sm px-20 py-1.5 text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-green-50 data-[state=active]:text-green-600 data-[state=active]:border-b-2 border-green-600 "+className
      }
      {...props}
      />

  )

}
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName
 
const TabsContent = ({ className, ...props }) => {
  return(
      <TabsPrimitive.Content

      className={
        "mt-2  font-normal ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2   "+className
  
      }
      {...props}
    />

  )

    }
TabsContent.displayName = TabsPrimitive.Content.displayName
 
export { Tabs, TabsList, TabsTrigger, TabsContent }