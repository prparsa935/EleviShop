import Axios from "axios";
import { serverAddress } from "../App";

const getAllCategories = async (setCategories) => {
  const res = await Axios.get(serverAddress + "category");
  if (res.status === 200) {
    const data = await res.data;

    setCategories(data.childCategories);
  }
};
const saveCategory = async (setErrors, setToastList) => {
  try {
    const res = await Axios.get(serverAddress + "category");
    if (res.status === 200) {
      setToastList((prev) => {
        return [
          ...prev,
          {
            type: "success",
            message: "گروه کالایی مورد نظر با موفقیت ایجاد شد",
          },
        ];
      });
    }
  } catch (error) {
    if (error.response) {
      setErrors(() => {
        return error.response.data.apiExceptions;
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
  }
};
export { getAllCategories };
