import { useState } from "react"

const Badge=(props)=>{
    
    return(
        <div className="relative inline-block mt-4">
            {/* todo dynamic position */}
            <div style={{transform:'translate(-50%, -50%)'}} className={"absolute inline-block "+(props.position?props.position:'top-0 left-0')}>

                    {props.content}

      

            </div>
         
            {props.children}

            
            
        </div>
    )
}
export default Badge