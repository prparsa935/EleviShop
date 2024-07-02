import Axios from "axios";
import { serverAddress } from "../App";
const searchProducts = async (searchParams, setProductList) => {
  console.log(searchParams)
  const res = await Axios.get(serverAddress+'product', {
    params: searchParams,
  });
  if (res.status === 200) {
    const resData = await res.data;
      console.log(resData)
      setProductList(resData);
    
  } else {
    console.log("hello");
  }
};
export { searchProducts };
