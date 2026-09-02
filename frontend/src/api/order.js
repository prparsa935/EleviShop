import Axios from "axios";
import { serverAddress } from "../App";

const ORDERS_PAGE_SIZE = 5;

// state: current | delivered | canceled
// fetches one page (latest first) and appends it to the given list
const findOrderByState = async (
  state,
  setOrders,
  setToastList,
  setLoading,
  page = 1,
  setPage,
  setHasMore,
  setTotal
) => {
  try {
    const response = await Axios.get(serverAddress + "order/" + state, {
      params: { pageNumber: page },
    });

    if (response.status === 200) {
      const { orders, total } = response.data ?? {};
      const fetchedOrders = orders ?? [];

      setTotal?.(total ?? 0);

      if (fetchedOrders.length === 0) {
        setHasMore?.(false);
        if (page === 1) {
          setOrders([]);
        }
        return;
      }

      setHasMore?.(
        (page - 1) * ORDERS_PAGE_SIZE + fetchedOrders.length < (total ?? 0)
      );
      setPage?.(page + 1);
      setOrders((prev) => {
        if (page === 1) return fetchedOrders;
        const seen = new Set((prev ?? []).map((order) => order.id));
        return [...(prev ?? []), ...fetchedOrders.filter((order) => !seen.has(order.id))];
      });
    }
  } catch (error) {
    if (error.response) {
      setToastList?.((prev) => {
        return [
          ...prev,
          {
            type: "danger",
            message: error.response.data?.overallError?.message,
          },
        ];
      });
    } else {
      setToastList?.((prev) => {
        return [
          ...prev,
          {
            type: "danger",
            message: "در ارتباط با سرور مشکلی پیش امده",
          },
        ];
      });
    }
  } finally {
    setLoading?.(false);
  }
};
// counts per tab: { current, delivered, canceled }
const getOrdersCounts = async (setCounts, setToastList) => {
  try {
    const response = await Axios.get(serverAddress + "order/counts");
    if (response.status === 200) {
      setCounts?.(response.data ?? {});
    }
  } catch (error) {
    setToastList?.((prev) => [
      ...prev,
      {
        type: "danger",
        message: error.response?.data?.overallError?.message ?? "در دریافت آمار سفارشات مشکلی پیش آمد",
      },
    ]);
  }
};

export { findOrderByState, getOrdersCounts, ORDERS_PAGE_SIZE };
