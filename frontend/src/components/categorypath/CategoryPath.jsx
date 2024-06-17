const CategoryPath=()=>{
    return(
        <div className="w-100 flex font-semibold text-xs text-slate-400 px-5">
            {['ذیجیکالا','مد و پوشاک','مردانه','سویشرت مردانه'].map((category, index) => (
            <>
                {index===0?'':
                    <div className="mx-3">
                        /
                    </div>
                }
        
                <div className=" cursor-pointer">
                    {category}
                    
                </div>
            </>


            ))}

       </div>

    )
}
export default CategoryPath