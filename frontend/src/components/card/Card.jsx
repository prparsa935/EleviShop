
const Card=(props)=>{
    return(

        <div className={" border flex flex-col justify-between"+" "+props.moreCss}>
            {props.header?(
                <div className={'w-100 px-7 py-7'+" "+(props.headerBorder?'border-bottom':'')}>
                    {props.header}

                </div>
            ):(
                <></>
            )}
            <div className={'sub-txt-color px-7 py-7  '+(props.moreBodyClass)}>
                {props.children}
            
            </div>
      
  
            {props.footer?(
                <div className={'w-100 px-7 py-10'+" "+(props.footerBorder?'border-top':'')}>
                    {props.footer}

                </div>
            ):(
                <></>
            )}


       

            

        </div>

    )
}
export default Card