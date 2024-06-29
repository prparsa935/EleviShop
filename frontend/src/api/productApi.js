import Axios from "axios";
const searchProducts = async (searchParams, setProductList) => {
  const res = await Axios.get("serversAddress", {
    params: searchParams,
  });
  if (res.status === 200) {
    const resData = res.data;
    if (resData.err === false) {
      setProductList(resData.data);
    }
  } else {
    console.log("hello");
  }
};
export { searchProducts };
