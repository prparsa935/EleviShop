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
  try {
    console.log("hellll");
    const res = await Axios.get(serverAddress + "product", {
      params: { ...searchParams, pageNumber: page },
    });
    if (res.status === 200) {
      const resData = await res.data;

      if (resData.length === 0) {
        setHasMore(false);

        if (page === 1) {
          setProductList([]);
        }
      } else {
        setHasMore(true);

        setPage(page + 1);
        setProductList([...productList, ...resData]);
      }
    }
  } catch (error) {
    setHasMore(false);

    if (page === 1) {
      setProductList([]);
    }
  }
};
const fetchSingleProduct = async (productId, setProduct) => {
  try {
    const res = await Axios.get(serverAddress + "product/id/" + productId);
    if (res.status === 200) {
      const resData = await res.data;
      console.log(resData);
      setProduct(resData);
    }

  } catch (error) {

  }

};
const fetchRelatedProducts = async (productId, productCode, setProducts) => {
  try {
    const res = await Axios.get(serverAddress + "product/id/" + productId + "/code/" + productCode);
    if (res.status === 200) {
      const resData = await res.data;
      setProducts(resData);
    }

  } catch (error) {


  }

}

export { searchProducts, fetchSingleProduct, fetchRelatedProducts };
