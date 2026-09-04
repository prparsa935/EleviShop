import Axios from "axios";
import { serverAddress } from "../App";

const handleRequestError = (error, setToastList) => {
  if (error.response) {
    setToastList((prev) => {
      return [
        ...prev,
        {
          type: "danger",
          message: error.response.data?.overallError?.message,
        },
      ];
    });
  } else {
    setToastList((prev) => {
      return [
        ...prev,
        {
          type: "danger",
          message: "در ارتباط با سرور مشکلی پیش امده",
        },
      ];
    });
  }
};

const findLowStockItems = async (
  threshold,
  setLowStockItems,
  setToastList,
  setLoading
) => {
  try {
    const response = await Axios.get(serverAddress + "stock/low-stock", {
      params: threshold !== null && threshold !== undefined ? { threshold: threshold } : {},
    });
    if (response.status === 200) {
      setLowStockItems(response.data?.data || []);
    }
  } catch (error) {
    handleRequestError(error, setToastList);
  } finally {
    setLoading(false);
  }
};

const findMovementHistory = async (
  inventoryId,
  setMovements,
  setToastList,
  setLoading
) => {
  try {
    const response = await Axios.get(
      serverAddress + "stock/movements/" + inventoryId
    );
    if (response.status === 200) {
      setMovements(response.data?.data || []);
    }
  } catch (error) {
    handleRequestError(error, setToastList);
  } finally {
    setLoading(false);
  }
};

const adjustStock = async (
  inventoryId,
  quantityChange,
  reason,
  setToastList
) => {
  try {
    const response = await Axios.post(serverAddress + "stock/adjust", {
      inventoryId: inventoryId,
      quantityChange: quantityChange,
      reason: reason,
    });
    if (response.status === 200 && response.data.success === true) {
      setToastList((prev) => [
        ...prev,
        {
          type: "success",
          message: response.data.successMessage,
        },
      ]);
      return true;
    }
    return false;
  } catch (error) {
    handleRequestError(error, setToastList);
    return false;
  }
};

export { findLowStockItems, findMovementHistory, adjustStock };
