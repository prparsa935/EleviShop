import Axios from "axios";
import { serverAddress } from "../App";
const searchProducts = async (searchParams, setProductList) => {

  const res = await Axios.get(serverAddress + 'product', {
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
const fetchSingleProduct = async (productId, setProduct) => {
  
  const res = await Axios.get(serverAddress + 'product/' + productId);
  if (res.status === 200) {
    const resData = await res.data;
    console.log(resData)
    setProduct(resData);

  } else {
    console.log("hello");
  }

}
export { searchProducts,fetchSingleProduct };
