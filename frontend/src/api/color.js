import axios from "axios";
import { serverAddress } from "../App";

const findColorByName = async (colorName, callback) => {
  try {
    const res = await axios.get(serverAddress + "color/findby", {
      colorName: colorName,
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
export { findColorByName };
