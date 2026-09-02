import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../icons/Loading";
import OrderBox from "../orderBox/OrderBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ordertab/OrderTab";
import { transformToPersianNumber } from "../../utils/helperMehods";

const OrdersTabBox = ({ tabsData, loadMore }) => {
  const tabs = [
    { state: "current", title: "جاری", tabState: tabsData?.current },
    { state: "delivered", title: "تحویل شده", tabState: tabsData?.delivered },
    { state: "canceled", title: "لغو شده", tabState: tabsData?.canceled },
  ];
  return (
    <div className="glass p-4 rounded-2xl flex flex-col">
      <div className="mb-10">
        <span className="font-semibold lg:text-lg text-[var(--color-white)]">تاریخچه سفارشات</span>
      </div>
      <Tabs
        activationMode={"manual"}
        defaultValue="current"
        orientation="vertical"
        className="grow "
      >
        <TabsList
          className={
            "w-100 lg:justify-start justify-around sticky top-[96px] mb-8 z-20  "
          }
        >
          {tabs.map((tab) => (
            <TabsTrigger key={tab.state} className={"lg:grow-0 grow "} value={tab.state}>
              <span className="ml-1 lg:text-base text-sm">{tab.title}</span>
              <span className="gold-bg !text-white min-w-[1.75rem] h-7 px-2 rounded-full text-xs font-semibold flex items-center justify-center">
                {transformToPersianNumber(String(tab.tabState?.total ?? 0))}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.state} data-state="active" value={tab.state}>
            <InfiniteScroll
              dataLength={tab.tabState?.orders?.length ?? 0}
              next={() => loadMore?.[tab.state]?.()}
              hasMore={tab.tabState?.hasMore ?? false}
              loader={
                <div className="w-100 flex justify-center overflow-hidden py-4">
                  <Loading className="w-5 h-5" />
                </div>
              }
            >
              <div className="flex flex-col gap-y-3 lg:mx-5">
                {tab.tabState?.orders?.map((order) => (
                  <OrderBox key={order?.id} order={order} />
                ))}
              </div>
            </InfiniteScroll>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
export default OrdersTabBox;
