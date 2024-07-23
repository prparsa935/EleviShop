import Button from "../Button/Button";

const SubmitCartBox = () => {
  return (
    <div className="lg:w-[300px] w-screen left-0 bg-white  justify-between items-center lg:items-stretch fixed bottom-[86px] flex lg:flex-col gap-y-4 border p-5 lg:sticky lg:top-[155px]">
      <div className="lg:flex   hidden justify-between text-neutral-500 font-semibold  ">
        <span>قیمت کالا ها (۲)</span>
        <div>
          <span className="ml-1">۲,۷۶۰,۰۰۰</span>
          <span>تومان</span>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col justify-between items-center  font-semibold lg:order-none order-2  ">
        <span>جمع سبد خرید</span>
        <div>
          <span className="ml-1">۲,۷۶۰,۰۰۰</span>
          <span>تومان</span>
        </div>
      </div>
      <div className="lg:flex hidden justify-between text-rose-600 font-semibold   ">
        <span>سود شما از خرید</span>
        <div>
          <span className="ml-1">۲,۷۶۰,۰۰۰</span>
          <span>تومان</span>
        </div>
      </div>
      <Button
        size="lg"
        shape="rounded-xl"
        bgColor="bg-rose-500"
        txtColor="text-white"
      >
        تایید و تکمیل سفارش
      </Button>
    </div>
  );
};
export default SubmitCartBox;
