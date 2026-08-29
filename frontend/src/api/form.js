import Axios from "axios";
import { serverAddress } from "../App";

const formApiHandler = async (
  address,
  object,
  setToastList,
  setErrors,
  setLoading
) => {
  try {
    console.log(object)
    const response = await Axios.post(serverAddress + address, object);

    if (response.status === 200 && response.data.success === true) {
      setToastList((prev) => [
        ...prev,
        {
          type: "success",
          message: response.data.successMessage,
        },
      ]);
      return true;
    }
    return false;
  } catch (error) {
    console.log(error)
    if (error.response) {
      setErrors(() => {
        return error.response.data.fieldErrors;
      });
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
    return false;
  } finally {
    setLoading(false);
  }
};

export default formApiHandler;
