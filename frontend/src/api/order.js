import Axios from "axios";
import { serverAddress } from "../App";

const findOrderByState = async (state, setOrders, setToastList, setLoading) => {
  try {
    console.log("afterfetch");
    const response = await Axios.get(serverAddress + "order/" + state);

    if (response.status === 200) {
      console.log("setorders");
      setOrders(response.data);
    }
  } catch (error) {
    console.log(error);
    if (error.response) {
      // setErrors(() => {
      //   return error.response.data.fieldErrors;
      // });
      setToastList((prev) => {
        return [
          ...prev,
          {
            type: "danger",
            message: error.response.data?.overallError?.message,
          },
        ];
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      setToastList((prev) => {
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
    console.log("loading");
    setLoading(false);
  }
};
export { findOrderByState };
