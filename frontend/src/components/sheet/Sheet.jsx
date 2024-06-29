import { useEffect, useRef, useState } from 'react'

const Sheet=(props)=>{
    const sheetRef=useRef()
    const sheetContent=useRef()
    const selectedSide=useRef(props.side?props.side:'bottom')

    const sheetControl=(side)=>{
        if(side=='top'){
            sheetRef.current.classList.add('data-[state=closed]:-translate-y-full','top-0','w-100')
            
        }
        else if(side=='bottom'){
            sheetRef.current.classList.add('data-[state=closed]:translate-y-full','bottom-0','w-100')
            
        }
        else if(side=='left'){
            sheetRef.current.classList.add('data-[state=closed]:-translate-x-full','left-0','h-100')
            
        }
        else if(side=='right'){
            sheetRef.current.classList.add('data-[state=closed]:translate-x-full','right-0','h-100')
            
        }

    }
    useEffect(()=>{
        sheetControl(selectedSide.current)
    },[])

    return(
        <div  data-state={props.state?props.state:'closed'}  ref={sheetRef}  className={"fixed flex  overflow-hidden flex-nowrap duration-500  border-2  "+props.className}>
            <div  ref={sheetContent}  className={" w-100 h-100   p-3 relative w-0   "+props.borderType+" "+props.moreClass}>
                <div onClick={()=>{props.setState('closed')}} role='button' className=' dialog-close-btn '><i class="fa fa-times" aria-hidden="true"></i></div>
                {props.children}
                
                

            </div>
        

         </div>

    )
}
export default Sheet
// import * as React from "react"
// import * as SheetPrimitive from "@radix-ui/react-dialog"

// import { X } from "lucide-react"
 
// import { cva } from "class-variance-authority"
 
// const Sheet = SheetPrimitive.Root
 
// const SheetTrigger = SheetPrimitive.Trigger
 
// const SheetClose = SheetPrimitive.Close
 
// const SheetPortal = SheetPrimitive.Portal
 
// const SheetOverlay = (({ className, ...props }) => (
//   <SheetPrimitive.Overlay
//     className={
//       "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 "+className}
//     {...props}

//   />
// ))
// SheetOverlay.displayName = SheetPrimitive.Overlay.displayName
 
// const sheetVariants = cva(
//     "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
//     {
//       variants: {
//         side: {
//           top: "inset-x-0 top-0 border-b data-[state=closed]:h-0 data-[state=open]:h-25 ",
//           bottom:
//             "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
//           left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
//           right:
//             "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
//         },
//       },
//       defaultVariants: {
//         side: "right",
//       },
//     }
//   )

 

 
// const SheetContent =(({ side = "right", className, children, ...props }) => (
//   <SheetPortal>
//     <SheetOverlay />
//     <SheetPrimitive.Content
     
//       className={sheetVariants({ side })+" "+ className}
//       {...props}
//     >
//       {children}
//       <SheetPrimitive.Close className="absolute  right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
//         <X className="h-4 w-4" />
//         <span className="sr-only">Close</span>
//       </SheetPrimitive.Close>
//     </SheetPrimitive.Content>
//   </SheetPortal>
// ))
// SheetContent.displayName = SheetPrimitive.Content.displayName
 
// const SheetHeader = ({
//   className,
//   ...props
// } ) => (
//   <div
//     className={
//       "flex flex-col space-y-2 text-center sm:text-left "+className}
//     {...props}
//   />
// )
// SheetHeader.displayName = "SheetHeader"
 
// const SheetFooter = ({
//   className,
//   ...props
// }) => (
//   <div
//     className={
//       "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 "+className}
//     {...props}
//   />
// )
// SheetFooter.displayName = "SheetFooter"
 
// const SheetTitle = (({ className, ...props }) => (
//   <SheetPrimitive.Title

//     className={"text-lg font-semibold text-foreground "+className}
//     {...props}
//   />
// ))
// SheetTitle.displayName = SheetPrimitive.Title.displayName
 
// const SheetDescription =(({ className, ...props }) => (
//   <SheetPrimitive.Description

//     className={"text-sm text-muted-foreground "+ className}
//     {...props}
//   />
// ))
// SheetDescription.displayName = SheetPrimitive.Description.displayName
 
// export {
//   Sheet,
//   SheetPortal,
//   SheetOverlay,
//   SheetTrigger,
//   SheetClose,
//   SheetContent,
//   SheetHeader,
//   SheetFooter,
//   SheetTitle,
//   SheetDescription,
// }