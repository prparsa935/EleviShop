import axios from "axios";
import { serverAddress } from "../App";

const fetchSingleItem = async (address, id, setItem, setLoading) => {
  try {
    const res = await axios.get(serverAddress + address + id);
    if (res.status === 200) {
      const resData = await res.data;
      console.log(resData);
      setItem(resData);
    } else {
      console.log("hello");
    }
  } catch (error) {
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};
export default fetchSingleItem;
