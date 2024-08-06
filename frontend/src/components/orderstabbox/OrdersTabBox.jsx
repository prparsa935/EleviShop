import OrderBox from "../orderBox/OrderBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ordertab/OrderTab";

const OrdersTabBox = () => {
  return (
    <div className="border p-4 flex flex-col">
      <div className="mb-10">
        <span className="font-semibold lg:text-lg">تاریخچه سفارشات</span>
      </div>
      <Tabs
        activationMode={"manual"}
        defaultValue="inProgress"
        orientation="vertical"
        className="grow "
      >
        <TabsList
          className={
            "w-100 lg:justify-start justify-around sticky top-[96px] mb-8  "
          }
        >
          <TabsTrigger className={"lg:grow-0 grow "} value="inProgress">
            <span className="ml-1 lg:text-base text-sm">جاری</span>

            <span className="bg-slate-400 !text-white w-5 h-5 rounded ">۳</span>
          </TabsTrigger>
          <TabsTrigger className={"lg:grow-0 grow"} value="sent">
            <span className="ml-1 lg:text-base text-sm ">تحویل شده</span>
          </TabsTrigger>
          <TabsTrigger className={"lg:grow-0 grow"} value="returned">
            <span className="ml-1 lg:text-base text-sm">لغو شده</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent data-state="active" value="inProgress">
          <div className="flex flex-col gap-y-3 lg:mx-5">
            <OrderBox/>
            <OrderBox/>
     
          </div>
        </TabsContent>
        <TabsContent data-state="active" value="sent">
          <div className="flex lg:gap-x-72 lg:flex-row flex-col mx-10 ">
            <div className=" lg:text-xl text-base font-medium text-neutral-700 mb-5">
              مشخصات
            </div>
            <div className="flex flex-col gap-y-8 ">
              <div className="flex lg:text-base text-xs ">
                <span className=" text-neutral-400 font-semibold ml-36  ">
                  جنس فریم
                </span>
                <span>TPE (الاستومر ترموپلاستیک)</span>
              </div>
              <div className="flex  lg:text-base text-xs ">
                <span className=" text-neutral-400 font-semibold  ml-36 ">
                  فرم فریم
                </span>
                <span>چند ضلعی فریم های خاص مربعی مستطیلی</span>
              </div>
              <div className="flex  lg:text-base text-xs">
                <span className=" text-neutral-400 font-semibold ml-36 ">
                  جنس فریم
                </span>
                <span>TPE (الاستومر ترموپلاستیک)</span>
              </div>
              <div className="flex lg:text-base text-xs">
                <span className=" text-neutral-400 font-semibold ml-36  ">
                  جنس فریم
                </span>
                <span>TPE (الاستومر ترموپلاستیک)</span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent data-state="active" value="returned">
          Tab three content
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default OrdersTabBox;
