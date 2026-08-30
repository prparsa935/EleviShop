import Axios from "axios";
import { serverAddress } from "../App";
import formApiHandler from "./form";
const fetchOffProducts = async (setProducts) => {
  try {
    const res = await Axios.get(serverAddress + "product", {
      params: { enableOff: true, pageNumber: 1 },
    });
    if (res.status === 200) {
      const resData = await res.data;
      setProducts(resData);
    }
  } catch (error) {}
};
const searchProducts = async (
  searchParams,
  productList,
  setProductList,
  page,
  setPage,
  setHasMore
) => {
  try {
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
const searchProducByNametWithCallback = async (name, callback) => {
  try {
    const res = await Axios.get(serverAddress + "product", {
      params: { name: name, page: 1 },
    });
    if (res.status === 200) {
      const resData = await res.data;
      const formattedOptions = resData.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      callback(formattedOptions);
    }
  } catch (error) {
    callback([]);
  }
};
const fetchSingleProduct = async (productId, setProduct, setLoading) => {
  try {
    const res = await Axios.get(serverAddress + "product/id/" + productId);
    if (res.status === 200) {
      const resData = await res.data;

      setProduct(resData);
    }
  } catch (error) {
  } finally {
    setLoading(false);
  }
};
const fetchRelatedProducts = async (productId, productCode, setProducts) => {
  try {
    const res = await Axios.get(
      serverAddress + "product/id/" + productId + "/code/" + productCode
    );
    if (res.status === 200) {
      const resData = await res.data;
      setProducts(resData);
    }
  } catch (error) {}
};

const fetchSetAvailableColors = async (productSetId, callback) => {
  try {
    const res = await Axios.get(
      serverAddress + "product/set/" + productSetId + "/available-colors"
    );
    if (res.status === 200) {
      callback(res.data);
    }
  } catch (error) {
    callback({ colors: [], hasNoCommonColor: true });
  }
};
const fetchSetAvailability = async (productSetId, colorId, callback) => {
  try {
    const res = await Axios.get(
      serverAddress + "product/set/" + productSetId + "/availability",
      { params: { colorId: colorId } }
    );
    if (res.status === 200) {
      callback(res.data);
    }
  } catch (error) {
    callback(null);
  }
};
const calcSetPricePreview = async (items, callback) => {
  try {
    const res = await Axios.post(serverAddress + "product/set/calc-price", {
      items: items,
    });
    if (res.status === 200) {
      callback(res.data);
    }
  } catch (error) {
    callback(null);
  }
};

export {
  searchProducts,
  fetchSingleProduct,
  fetchRelatedProducts,
  fetchOffProducts,
  searchProducByNametWithCallback,
  fetchSetAvailableColors,
  fetchSetAvailability,
  calcSetPricePreview,
};
