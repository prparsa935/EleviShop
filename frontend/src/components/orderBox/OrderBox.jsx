import productImg from '../../assets/img/947920b7e5d1b87552bff471172eb45237b15a03_1660396852.jpg'
const OrderBox = () => {
  return (
    <div className="flex flex-col border">
      {/* header */}
      <div className="flex flex-col border-b  ">
        <div className="flex justify-between items-center gap-y-2    m-4">
          <div className=" font-semibold">
            <i class="fa-solid fa-check text-green-400 ml-1"></i>
            <span>تحویل شده</span>
          </div>
          <i class="fa-solid fa-angle-left"></i>
        </div>

        <div className="flex lg:flex-row flex-col text-neutral-400 gap-x-4 m-4">
          <div className="flex gap-x-2 items-center">
            <span>۱۰</span>
            <span>اردیبهشت</span>
            <span>۱۴۰۲</span>
          </div>
          <div className="flex gap-x-2 items-center ">
            <span>کد سفارش</span>
            <span className="text-black">۱۷۲۱۱۰۴۵۶</span>
          </div>
          <div className="flex gap-x-2 items-center">
            <span>مبلغ</span>
            <span className="text-black">۵۴۸,۰۰۰</span>
            <span className="text-black">تومان</span>
          </div>
          <div className="flex gap-x-2 items-center">
            <span>تخفیف</span>
            <span className="text-black">۵۴۸,۰۰۰</span>
            <span className="text-black">تومان</span>
          </div>
        </div>
      </div>
      <div className='flex p-4 gap-x-4'>
        <img className='w-[64px] h-[64px]' src={productImg}/>
        <img className='w-[64px] h-[64px]' src={productImg}/>
        <img className='w-[64px] h-[64px]' src={productImg}/>
      </div>
    </div>
  );
};
export default OrderBox;
