import { useEffect, useRef, useState } from "react"
import './alert.css'
const Alert=(props)=>{
    // default type is warning
    const [bgColor,setBgColor]=useState('bg-bf-lighter-orange')
    const [textColor,setTextColor]=useState('text-bf-orange')
    const [iconCss,setIconCss]=useState('fas fa-exclamation-triangle')
    const [position,setPosition]=useState()

    const alertContainer=useRef()
    useEffect(()=>{
        if(props.type){
            const localType=props.type
            if(localType==="danger"){
   
                setIconCss( "fas fa-window-close")
                setBgColor('bg-bf-lighter-red')
                setTextColor('text-bf-red')
                

                
            }
            else if(localType==="info"){
           
                setIconCss("fa-solid fa-circle-info")
                setBgColor('bg-bf-lighter-sky')
                setTextColor('text-bf-sky')


            }
            else if(localType==="success"){
            
                setIconCss("fa-solid fa-check")
                setBgColor('bg-bf-lighter-green')
                setTextColor('text-bf-green')


            }
            if(props.duration){
                // setTimeout(() => {
                //     progressBar.current.classList.add('alert-progress-bar-active')
                    
                // }, 100);
               
                setTimeout(() => {
                    alertContainer.current.classList.add('alert-close')
                    
                    setTimeout(()=>{
                        alertContainer.current.remove()
                    
                      
                        
                    },400)
                   
                
                }, props.duration);

            }

        }

    },[])
    const closeAlert=()=>{
        alertContainer.current.classList.add('alert-close')
                    
        setTimeout(()=>{
            alertContainer.current.remove()
        
          
            
        },400)
    }

    return(
            <div ref={alertContainer} className="relative w-25 transition-400">
                
        
                <div  className={"  w-100   flex justify-between border p-3  "+bgColor+" "+textColor}>


                    <div className="flex">
                        {props.hideIcon?'':<i className={'mx-2 mt-1 '+iconCss}></i>}
                    
                        <div className="flex flex-col">

                            <h5 className=" text-lg font-bold ">{props.title}</h5>
                        
                            <span  className=" text-sm ">{props.children}</span>

                        </div>

                    </div>
                    <div  className="align-items-center d-flex">
                        {props.hideCloseBtn?'': <i onClick={()=>closeAlert()} role="button" class="fa fa-times" aria-hidden="true"></i>}
                    
                        
                    </div>
                    {/* todo create progress bar */}

                </div>
                <div  style={{animation:`progress ${props.duration}ms`}} className={"position-absolute top-100 right-0 alert-progress-bar bg-bf-orange  "}>
                
                </div>
            </div>
            
 
            
            



    )
}
export default Alert