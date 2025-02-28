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
    const response = await Axios.post(serverAddress + address, object);

    if (response.status === 200 && response.data.success === true) {
      setToastList((prev) => [
        ...prev,
        {
          type: "success",
          message: response.data.successMessage,
        },
      ]);
    }
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
    setLoading(false);
  }
};

export default formApiHandler;
