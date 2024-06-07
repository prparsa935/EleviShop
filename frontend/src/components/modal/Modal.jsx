import { useEffect, useRef } from 'react'
import './modal.css'
const Modal=(props)=>{
    const modalRef=useRef()
    const modalContent=useRef()
    const modalControl=(enable)=>{
        if(!enable){
            document.body.classList.remove('overflow-hidden')
            modalRef.current.classList.add('opa-0')
            modalContent.current.classList.add('scale-0')


        }
        else{
            document.body.classList.add('overflow-hidden')
            modalRef.current.classList.remove('opa-0')
   
            modalContent.current.classList.remove('scale-0')

        }

    }
    useEffect(()=>{
        modalControl(props.enable)

    },[props.enable])
    return(
        <div ref={modalRef} className={"absolute top-0 w-100 h-100vh flex justify-center  bg-opacity-70 bg-black duration-500     "}>
            <div ref={modalContent} style={{height:props.height}}  className={" bg-white modal-content border p-12 relative scale-0 duration-500 "+props.borderType+" "+'modal-'+props.size+" "+props.moreClass}>
                <div onClick={()=>{modalControl(false)}} role='button' className=' dialog-close-btn '><i class="fa fa-times" aria-hidden="true"></i></div>
                {props.children}
                
                

            </div>
        

        </div>

    )
}
export default Modal