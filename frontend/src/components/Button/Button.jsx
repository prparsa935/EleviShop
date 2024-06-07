import { useEffect, useState } from "react"

const Button=(props)=>{

    const [sizeCss,setSizeCss]=useState(' px-4 py-2 h6 ')
    const [shapeCss,setShapeCss]=useState(' rounded ')
    
    

    useEffect(()=>{
        console.log(props.moreCss)
        if(props.size){
            const size=props.size
            if(size==='lg'){
               
                setSizeCss('px-8 py-3 text-base font-bold ')
            }
            else if(size==='md'){
                setSizeCss('px-6 py-2 text-sm font-semibold')
            }
            else if(size==='sm'){
                setSizeCss('px-4  py-2 text-sm font-medium')
            }
            else if(size==='xs'){
                setSizeCss('px-4  py-1 text-xs font-normal ')
            }
        }
        if(props.shape){
            setShapeCss(props.shape)
            if(props.shape==='rounded-full'){
                setSizeCss('h6 p-2')

            }
          
        }
        
    },[])

    return(
        <button {...props} disabled={props.disabled} type={props.type} onClick={props.onClick} className={"   duration-100   button flex items-center justify-center"+" "+(props.border?props.border:'border')+" "+props.hoverClass+" "+sizeCss+" "+shapeCss+" "+props.bgColor+" "+props.txtColor +" "+(props.disabled?' text-slate-500':'')+" "+(props.col?'flex-col':'')+" "+props.moreCss}>
            {props.icon?<div className={props.col?"mb-1":"ml-1"}>{props.icon}</div>:<></>}
            
            {props.children}

        </button>
    )

}
export default Button