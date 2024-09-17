import { useEffect, useState } from "react";
import OrderBox from "../orderBox/OrderBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ordertab/OrderTab";
import { findOrderByState } from "../../api/order";

const OrdersTabBox = ({ setToastList }) => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  useEffect(() => {
    findOrderByState("current", setCurrentOrders, setToastList);
    findOrderByState("canceled", setCanceledOrders, setToastList);
    findOrderByState("delivered", setDeliveredOrders, setToastList);
  }, []);
  return (
    <div className="border p-4 flex flex-col">
      <div className="mb-10">
        <span className="font-semibold lg:text-lg">تاریخچه سفارشات</span>
      </div>
      <Tabs
        activationMode={"manual"}
        defaultValue="current"
        orientation="vertical"
        className="grow "
      >
        <TabsList
          className={
            "w-100 lg:justify-start justify-around sticky top-[96px] mb-8  "
          }
        >
          <TabsTrigger className={"lg:grow-0 grow "} value="current">
            <span className="ml-1 lg:text-base text-sm">جاری</span>

            <span className="bg-slate-400 !text-white w-5 h-5 rounded ">۳</span>
          </TabsTrigger>
          <TabsTrigger className={"lg:grow-0 grow"} value="delivered">
            <span className="ml-1 lg:text-base text-sm ">تحویل شده</span>
          </TabsTrigger>
          <TabsTrigger className={"lg:grow-0 grow"} value="canceled">
            <span className="ml-1 lg:text-base text-sm">لغو شده</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent data-state="active" value="current">
          <div className="flex flex-col gap-y-3 lg:mx-5">
            {currentOrders?.map((order) => {
              return <OrderBox order={order} />;
            })}
            <OrderBox />
          </div>
        </TabsContent>
        <TabsContent data-state="active" value="delivered">
          <div className="flex flex-col gap-y-3 lg:mx-5">
            {deliveredOrders?.map((order) => {
              return <OrderBox order={order} />;
            })}
          </div>
        </TabsContent>
        <TabsContent data-state="active" value="canceled">
          <div className="flex flex-col gap-y-3 lg:mx-5">
            {canceledOrders?.map((order) => {
              return <OrderBox order={order} />;
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default OrdersTabBox;
