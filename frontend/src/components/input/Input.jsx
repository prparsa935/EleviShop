import { useEffect } from 'react'
import Loading from '../icons/Loading'
import './input.css'
const Input=(props)=>{

    const renderAffix=()=>{
        if(props.invalid){
            return(
                <div className='mx-1  h-100 flex items-center absolute left-0 text-bf-red'>
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" class="text-red-500 text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
  

                </div>
              

            )
        }
        else if(props.affix){
            return(
                <div className='mx-1  h-100 flex items-center absolute left-0'>
                    {props.affix}
      

                </div>

            )

        }
    }
    return(
        <div style={{width:props.width}} className='flex flex-col'>
            <div   className={" relative  input-container  flex items-center  "+" "+(props.disabled?'sub-txt-color':'')+' '+props.inputclassName}  >
                {props.preffix?(
                    <div className='mx-2  h-100 flex items-center absolute right-0 '>
                        {props.preffix}
                    </div>

                ):(
                    <></>
                )}
        
                {props.type==='textarea'?(
                    <textarea onChange={props.onChange} value={props.value} disabled={props.disabled} type={props.type} placeholder={props.placeHolder}  className={" flex-grow  custom-input    rounded w-100 "+(props.invalid?'border-bf-red  ':'')} style={{
                    height:props.height
                    }} />

                ):(
                    <input name={props.name} onBlur={props.onBlur} onChange={props.onChange} value={props.value} disabled={props.disabled} type={props.type} placeholder={props.placeHolder}  className={" flex-grow  custom-input    rounded w-100 "+(props.invalid?'border-bf-red  ':'')} style={{
                        height:props.height
                    }} />
    
                    
                )}

                    {renderAffix()}


            </div>
            
            <div  className={'text-bf-red  mt-1  transition-400 font-bold overflow-hidden  '+(props.invalid?'h-4':'h-0')}>
                لطفا پسور را درست وارد کنید
            </div>
        </div>


    )
}
export default Input