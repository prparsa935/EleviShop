import Axios from "axios";
import { serverAddress } from "../App";
import formApiHandler from "./form";

const searchProducts = async (
  searchParams,
  productList,
  setProductList,
  page,
  setPage,
  setHasMore
) => {
  console.log("hellll");
  const res = await Axios.get(serverAddress + "product", {
    params: { ...searchParams, pageNumber: page },
  });
  if (res.status === 200) {
    const resData = await res.data;
    console.log(resData);
    if (resData.length === 0) {
      setHasMore(false);

      if (productList.length === 0) {
        setProductList([]);
      }
      return;
    }
    setPage(page + 1);
    setProductList([...productList, ...resData]);
    setHasMore(true);
  } else {
    console.log("hello");
  }
};
const fetchSingleProduct = async (productId, setProduct) => {
  const res = await Axios.get(serverAddress + "product/id/" + productId);
  if (res.status === 200) {
    const resData = await res.data;
    console.log(resData);
    setProduct(resData);
  } else {
    console.log("hello");
  }
};

export { searchProducts, fetchSingleProduct };
