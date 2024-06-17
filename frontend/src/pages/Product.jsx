import CategoryPath from "../components/categorypath/CategoryPath"
import { useState } from "react"
import productImageTest from '../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp'
import Tag from "../components/tag/Tag"
import Button from "../components/Button/Button"
import Separator from "../components/separator/Separator"
const Product=()=>{
    const [liked,setLiked]=useState(false)
    return(
        <div className="flex flex-col gap-y-5  mt-7 mx-auto max-w-screen-2xl">
            {/* category path */}
            <CategoryPath/>
            {/* unit product */}
            <div className="flex flex-col lg:flex-row justify-between">
                {/* right side */}
                <div className="lg:w-6/12 w-100 flex flex-col gap-y-3 lg:px-4">
                    
                    <div className="p-3 bg-rose-100 text-rose-600 text-base font-semibold order-2 lg:order-1 ">
                        فروش ویژه
                    </div>
                    {/* main photo and stuff like favarite btn */}
                    <div className="flex flex-col lg:flex-row gap-y-4 mt-3 order-1 lg:order-2">
                        {/* favorite btn and ... */}
                        <div className="flex lg:flex-col px-3 text-xl lg:w-14 lg:gap-y-5 gap-x-5 ">
                            {liked?(
                                <i class="fa-solid fa-heart text-red-600"></i>
                                
                            ):(
                                <i class="fa-regular fa-heart"></i>
                            )
                            }
                            <i class="fa-light fa-share-nodes"></i>
                            <i class="fa-regular fa-bell"></i>
                   
                            

                        </div>
                        <div className="mx-auto ">
                            <img className="h-[250px] lg:h-auto" src={productImageTest}></img>

                        </div>

                       
                        

                    </div>

                </div>
                {/* (detail)leftside */}
                <div className="flex flex-col w-100">
                    {/* title */}
                    <div className="p-3 border-b ">
                        <p className=" font-medium  sm:text-xl text-base  ">
                             سویشرت مردانه مدل F120 رنگ مشکی

                        </p>
                       

                    </div>
                    {/* detail and add to cart */}
                    <div className="flex lg:flex-row flex-col w-100">
                        {/* detail */}
                        <div className="grow flex flex-col gap-y-4  mt-2  ">
                            {/* rate */}
                            <div className="flex items-center text-xs   ">
                                <div className="gap-x-1 flex items-center ml-3    ">
                                    <i class="fa-duotone fa-star text-amber-600"></i>
                                    <span className="">۴.۲</span>
                                    <span className=" text-slate-400 ">(امتیاز ۲۷ خریدار)</span>
                                    

                                </div>
                                <div className="gap-x-1 flex  items-center text-xs    ">
                                    <span className=" text-sky-400 ">18 دیدگاه</span>
                                    

                                </div>

                                
                            </div>
                            {/* features */}
                            <div className="flex flex-col ">
                                <h3 className="text-xl mb-2">
                                    ویژگی ها
                                </h3>
                                {/* product feature card */}
                                <div className="grid grid-cols-3">
                                    {Array.from({ length: 6 }).map((_, index) => (
                                    <div className="p-3 flex flex-col bg-neutral-100 rounded-xl m-1 text-sm font-semidbold">
                                        <h5 className=" text-slate-400  ">
                                            جنس
                                        </h5>
                                        <p className="  text-neutral-700">
                                        پشم، پلی استر، نخ
                                        </p>
                                        

                                    </div>
                                    ))}
                                    

                                </div>
                                <div className="flex justify-between items-center mt-3">
                                    <Separator className={' bg-slate-300 !shrink'} orientation='horizontal'></Separator>
                                    <Button size='sm'  moreCss='w-98 mx-5 w-[28rem]' leftIcon={<i class="fa-solid fa-angle-left"></i>}>مشاهده همه ویژگی ها</Button>
                                    <Separator className={' bg-slate-300 !shrink '}  orientation='horizontal'></Separator>

                                </div>
                                

                            </div>
                            
                            

                        </div>
                        {/* add to cart */}
                        <div className="lg:w-[333px] w-100  ">
                            {/* add to cart */}
                            <div className="border rounded-2xl flex flex-col p-3 border-t-0 gap-y-6 lg:ml-4">
                                <div className="  flex font-semibold text-xs pb-4 border-b">
                                    <div className="mx-1  text-slate-400">
                                        رضایت از کالا

                                    </div>
                                    <div className="mx-1 font-semibold text-xs text-green-500">
                                        ۹۰٪

                                    </div>
                                </div>


                                <div className="flex justify-between align-center">
                                    <i class="fa-regular fa-circle-exclamation text-slate-400"></i>
                                    <div className="flex flex-col ">
                                        <div className="flex align-bottom ">
                                            <span className="line-through mx-3 text-xs text-slate-400 flex items-center">
                                                ۲۳۰,۰۰۰
                                                
                                            </span>
                                            <Tag size='xs' bgColor='bg-red-500' txtColor='text-white' morCss='' >۵۷٪</Tag>
                                     

                                        </div>
                                        <div className=" font-bold">
                                            <span className="mx-1  text-lg">
                                            ۹۷,۰۰۰

                                            </span>
                                            <span>
                                                تومان
                                            </span>
                                   

                                        </div>

                                    </div>
                                   
                                    
                                </div>
                                <div className="">
                                    <Button txtColor='text-white' bgColor='bg-rose-500' size='lg' moreCss='w-100' shape='rounded-2xl' >افرودن به سبد</Button>
                                </div>
                                
                                

                            </div>


                        </div>

                    </div>

                </div>
           
                
            </div>

        </div>
    )
}
export default Product