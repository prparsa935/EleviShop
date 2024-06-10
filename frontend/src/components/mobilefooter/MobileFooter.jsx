import Button from "../Button/Button"

const MobileFooter=()=>{
    return(
        <div className="w-100 fixed flex justify-around items-center  lg:hidden bottom-0 left-0 px-7 py-3 border-t-2 bg-white z-50">

            <Button col size='md' border='none ' icon={<i class="fa-light fa-house"></i>}>خانه</Button>
            <Button txtColor='text-slate-500' col size='md' border='none ' icon={<i class="fa-light fa-objects-column"></i>}>دسته بندی</Button>
            <Button txtColor='text-slate-500' col size='md' border='none ' icon={<i className=" font-medium fa-light fa-cart-shopping"></i>}>سبد</Button>
            <Button txtColor='text-slate-500' col  size='md' border='none ' icon={<i class="fa-light fa-user"></i>}>پروفایل</Button>
            

        </div>

    )
}
export default MobileFooter