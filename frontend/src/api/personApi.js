import Axios from "axios";
import { serverAddress } from "../App";

const getPerson = async (setPerson, setToastList) => {
  try {
    const response = await Axios.get(serverAddress + "person");

    if (response.status === 200) {
      const person = await response.data;

      setPerson(person);
    }
  } catch (error) {
  
    if (error?.response) {
      // setErrors(() => {
      //   return error.response.data.apiExceptions;
      // });
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
export { getPerson };
