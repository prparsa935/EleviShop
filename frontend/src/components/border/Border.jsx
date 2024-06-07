const Border=(props)=>{
    return(
        <div  {...props} className={' bg-transparent -z-10 absolute  h-100  '+(props.border?props.border:'border-b-2 border-red-500')+" "+(props.moreCss?props.moreCss:'')}>
            
            

        </div>
    )
}
export default Border