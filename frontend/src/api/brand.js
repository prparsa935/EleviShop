import axios from "axios";
import { serverAddress } from "../App";

const findBrandByName = async (brandName, callback) => {
  try {
    const res = await axios.get(serverAddress + "brand/findBy", {
      params: { brandName: brandName },
    });
    if (res.status === 200) {
      const formattedOptions = res.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      callback(formattedOptions);
    }
  } catch (error) {
    callback([]);
  }
};
export { findBrandByName };
