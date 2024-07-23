import Axios from "axios";
import { serverAddress } from "../App";


const searchProducts = async (searchParams,productList, setProductList,page,setPage,setHasMore) => {

  const res = await Axios.get(serverAddress+'product', {
    params: {...searchParams,page},
  });
  if (res.status === 200) {
    const resData = await res.data;
    if(res.data.length===0){
      setHasMore(false)
      return
    }
    setPage(page+1)
    setProductList([...productList,resData]);
    

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
