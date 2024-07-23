import './skeleton.css'
const Skeleton=(props)=>{
    
    return(
        <div style={{
            width:props.width,
            height:props.height
        }} className={"skeleton"+" "+(props.variant==='circle'?'rounded-full':'rounded')+' '+props.className}>
          
        </div>
    )
    
}
export default Skeleton