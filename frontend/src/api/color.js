import axios from "axios";
import { serverAddress } from "../App";

const findColorByName = async (colorName, callback) => {
  try {
    const res = await axios.get(serverAddress + "color/findBy", {
      params: { colorName: colorName },
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
const findColorByNamePaging = async (
  colorName,
  colorList,
  setColorList,
  page,
  setPage,
  setHasMore
) => {
  try {
    console.log("hellll");
    const res = await axios.get(serverAddress + "color", {
      params: { colorName: colorName, pageNumber: page },
    });
    if (res.status === 200) {
      const resData = await res.data;

      if (resData.length === 0) {
        setHasMore(false);

        if (page === 1) {
          setColorList([]);
        }
      } else {
        setHasMore(true);

        setPage(page + 1);
        setColorList([...colorList, ...resData]);
      }
    }
  } catch (error) {
    setHasMore(false);

    if (page === 1) {
      setColorList([]);
    }
  }
};
export { findColorByName, findColorByNamePaging };
