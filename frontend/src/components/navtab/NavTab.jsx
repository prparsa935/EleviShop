import { useEffect, useRef } from "react"
import Border from "../border/Border"

const NavTab=(props)=>{
   
    const controlEnterTab=(el)=>{
        el.childNodes[0].setAttribute('data-active','true')

    }
    const controlLeaveTab=(el)=>{
        el.childNodes[0].setAttribute('data-active','false')

    }


    return(
            <div  className="relative   flex " onMouseLeave={(e)=>controlLeaveTab(e.currentTarget)} onMouseEnter={(e)=>controlEnterTab(e.currentTarget)}  >
                <Border   data-active='false' moreCss=' w-full duration-500 data-[active=false]:w-0 ' border='border-b-2 border-red-500'  ></Border>
                {props.children}
            
            </div>
    )
}
export default NavTab