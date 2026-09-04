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
      const fieldErrors = error.response.data?.fieldErrors;
      setErrors(() => fieldErrors);
      const overallMessage = error.response.data?.overallError?.message;
      const hasFieldErrors =
        fieldErrors && Object.keys(fieldErrors).length > 0;
      const message =
        overallMessage ||
        (hasFieldErrors ? "لطفا خطاهای مشخص شده در فرم را برطرف کنید" : null);
      if (message) {
        setToastList((prev) => {
          return [
            ...prev,
            {
              type: "danger",
              message: message,
            },
          ];
        });
      }
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
