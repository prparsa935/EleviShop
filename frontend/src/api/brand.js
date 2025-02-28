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

const findBrandByNamePaging = async (
  brandName,
  brandList,
  setBrandList,
  page,
  setPage,
  setHasMore
) => {
  try {
  
    const res = await axios.get(serverAddress + "brand", {
      params: { brandName: brandName, pageNumber: page },
    });
    if (res.status === 200) {
      const resData = await res.data;

      if (resData.length === 0) {
        setHasMore(false);

        if (page === 1) {
          setBrandList([]);
        }
      } else {
        setHasMore(true);

        setPage(page + 1);
        setBrandList([...brandList, ...resData]);
      }
    }
  } catch (error) {
    setHasMore(false);

    if (page === 1) {
      setBrandList([]);
    }
  }
};
export { findBrandByName, findBrandByNamePaging };
