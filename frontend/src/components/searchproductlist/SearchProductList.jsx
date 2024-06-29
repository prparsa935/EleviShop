import productImageTest from "../../assets/img/0a099b45d73a6607595ec7f1e39c5d3f1a08a2e6_1620035268.webp";

const SearchProductList = ({ productList }) => {
  return (
    <div className="h-96   flex-grow lg:mr-5 grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 ">
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="flex flex-col p-3 gap-y-3 border border-slate-200  hover:shadow-lg cursor-pointer">
          <div className="mx-auto mt-4">
            <img className="h-[240px] w-[240px]" src={productImageTest} />
          </div>
          <div className="h-[72px] overflow-hidden font-medium  text-xs text-slate-700 !leading-7 ">
            گوشی موبایل سامسونگ مدل Galaxy S24 Ultra دو سیم کارت ظرفیت 256
            گیگابایت و رم 12 گیگابایت - ویتنام
          </div>
          <div className="flex justify-between items-center ">
            <div className="text-red-600 text-xs font-medium ">
              تنها ۱ عدد در انبار باقی مانده
            </div>
            <div className="text-xs">
              <span className="mx-2 font-bold text-slate-800">۴.۴</span>
              <i class="fa-duotone fa-star text-amber-600"></i>
            </div>
          </div>
          <div className="flex justify-end text-base font-bold text-slate-600 mb-2">
            <span className="mx-1">۶۴,۰۰۰,۰۰۰</span>
            <span>تومان</span>
          </div>
        </div>
      ))}
      {productList.map((_, index) => (
        <div className="flex flex-col p-3 gap-y-3 border border-slate-200  hover:shadow-lg cursor-pointer">
          <div className="mx-auto mt-4">
            <img className="h-[240px] w-[240px]" src={productImageTest} />
          </div>
          <div className="h-[72px] overflow-hidden font-medium  text-xs text-slate-700 !leading-7 ">
            گوشی موبایل سامسونگ مدل Galaxy S24 Ultra دو سیم کارت ظرفیت 256
            گیگابایت و رم 12 گیگابایت - ویتنام
          </div>
          <div className="flex justify-between items-center ">
            <div className="text-red-600 text-xs font-medium ">
              تنها ۱ عدد در انبار باقی مانده
            </div>
            <div className="text-xs">
              <span className="mx-2 font-bold text-slate-800">۴.۴</span>
              <i class="fa-duotone fa-star text-amber-600"></i>
            </div>
          </div>
          <div className="flex justify-end text-base font-bold text-slate-600 mb-2">
            <span className="mx-1">۶۴,۰۰۰,۰۰۰</span>
            <span>تومان</span>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SearchProductList;
