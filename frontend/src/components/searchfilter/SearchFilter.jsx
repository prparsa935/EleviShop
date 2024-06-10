import Switch from '../switch/Switch'
const SearchFilter=()=>{
    return(
            <div className="border min-w-72    flex-col gap-y-8 p-6 rounded-2xl hidden lg:flex">
                <div className='flex justify-between items-center cursor-pointer'>
                    <h3 className=" text-xl font-semibold text-slate-700 cursor-pointer ">
                        فیلتر ها

                    </h3>
                    <div className=' text-sky-500 text-xs font-bold'>
                    حذف فیلتر ها
                    </div>

                </div>
      
       
                <div className="flex justify-between items-center cursor-pointer">
                    <h5 className=" text-sm font-medium text-slate-700  ">
                    دسته بندی 

                    </h5>
                    <i class="fa-duotone fa-angle-down ml-1"></i>


                </div>
                <div className="flex justify-between items-center cursor-pointer">
                    <h5 className=" text-sm font-medium text-slate-700 ">
                    محدوده قیمت

                    </h5>
                    <i class="fa-duotone fa-angle-down ml-1"></i>


                </div>
                <div className="flex justify-between items-center cursor-pointer">
                    <h5 className=" text-sm font-medium text-slate-700  ">
                    فقط کالا های موجود 

                    </h5>
                    <Switch></Switch>
                    


                </div> 


            </div>
    )
}
export default SearchFilter