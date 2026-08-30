import React, { useEffect, useRef, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import Axios from "axios";
import { serverAddress } from "../App";
import { useLocation, useNavigate } from "react-router-dom";

import useDidUpdateEffect from "../hooks/useDidUpdateEffect";
import { trackEvent } from "../hooks/useAnalytics";
const AuthContext = React.createContext();

const getCartItemKey = (item) => {
  if (item?.itemType === "SET") {
    return `set:${item?.product?.id}:${item?.color?.id}`;
  }
  return `inv:${item?.inventory?.id}`;
};

const toSyncPayload = (items) =>
  (items || []).map((item) => {
    if (item?.itemType === "SET") {
      return {
        itemType: "SET",
        productSetId: item?.product?.id,
        colorId: item?.color?.id,
        count: item?.quantity,
      };
    }
    return {
      inventoryId: item?.inventory?.id,
      count: item?.quantity,
    };
  });

const AuthProvider = (props) => {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies("access");
  const [registerErrM, setregisterErrM] = useState(null);
  const [access, setAccess] = useState(
    cookies?.access ? cookies?.access : null
  );
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [shoppingCart, setShoppingCart] = useState(
    JSON.parse(localStorage?.getItem("shoppingCart")) || []
  );
  const count = useRef(false);
  const skipNextSyncRef = useRef(false);
  const lastSyncedCartRef = useRef(
    JSON.stringify(JSON.parse(localStorage?.getItem("shoppingCart")) || [])
  );
  const [user, setUser] = useState(
    cookies?.access ? jwtDecode(cookies?.access) : null
  );
  const url = useLocation();
  useDidUpdateEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [shoppingCart]);

  const syncCartWithServer = async (items, replace) => {
    const response = await Axios.post(serverAddress + "cart/sync", {
      items: toSyncPayload(items),
      replace: replace,
    });
    return response;
  };
  useEffect(() => {
    if (!user || !access) {
      return undefined;
    }
    const cartJson = JSON.stringify(shoppingCart);
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      lastSyncedCartRef.current = cartJson;
      return undefined;
    }
    if (lastSyncedCartRef.current === cartJson) {
      return undefined;
    }
    const timer = setTimeout(async () => {
      lastSyncedCartRef.current = JSON.stringify(shoppingCart);
      try {
        await syncCartWithServer(shoppingCart, true);
      } catch (error) {}
    }, 800);
    return () => clearTimeout(timer);
  }, [shoppingCart, user, access]);

  const updateShoppingCart = async (setLoading) => {
    let invalidKeys = [];
    let lShoppingCart = JSON.parse(JSON.stringify(shoppingCart));
    try {
      const checkPromises = shoppingCart.map(async (productInCart, index) => {
        if (productInCart?.itemType === "SET") {
          return checkSetItemInCart(
            productInCart,
            index,
            invalidKeys,
            lShoppingCart
          );
        }
        return checkItemInCart(
          productInCart,
          index,
          invalidKeys,
          lShoppingCart
        );
      });

      await Promise.all(checkPromises);

      deleteInvalidItems(invalidKeys, lShoppingCart);
      setShoppingCart(lShoppingCart);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const checkItemInCart = async (
    productInCart,
    productInCartIndex,
    invalidKeys,
    lShoppingCart
  ) => {
    const res = await Axios.get(
      serverAddress + "product/id/" + productInCart.product.id
    );
    if (res.status === 200) {
      const product = await res.data;
      const iSelectedInventory = product?.inventories.find((inventory) => {
        return inventory.id === productInCart.inventory.id;
      });

      if (
        isProductInCartValid(
          iSelectedInventory?.quantity,
          productInCart?.quantity
        ) ||
        iSelectedInventory?.quantity !== 0
      ) {
        updateItemInCart(
          productInCartIndex,
          productInCart,
          product,
          iSelectedInventory,
          lShoppingCart
        );
      } else {
        invalidKeys.push(getCartItemKey(productInCart));
      }
    } else {
    }
  };
  const checkSetItemInCart = async (
    itemInCart,
    index,
    invalidKeys,
    lShoppingCart
  ) => {
    try {
      const res = await Axios.get(
        serverAddress +
          "product/set/" +
          itemInCart?.product?.id +
          "/availability",
        { params: { colorId: itemInCart?.color?.id } }
      );
      if (res.status === 200) {
        const data = res.data;
        if (
          !data ||
          data.availableQuantity == null ||
          data.availableQuantity === 0
        ) {
          invalidKeys.push(getCartItemKey(itemInCart));
          return;
        }
        lShoppingCart[index]["price"] = data.price;
        lShoppingCart[index]["availableQuantity"] = data.availableQuantity;
        lShoppingCart[index]["setPriceIsManual"] = data.isManual;
        lShoppingCart[index]["setCalculatedPrice"] = data.calculatedPrice;
        if (itemInCart?.quantity > data.availableQuantity) {
          lShoppingCart[index]["quantity"] = data.availableQuantity;
        }
      }
    } catch (error) {
      invalidKeys.push(getCartItemKey(itemInCart));
    }
  };
  const updateItemInCart = (
    productInCartIndex,
    productInCart,
    product,
    iSelectedInventory,
    lShoppingCart
  ) => {
    lShoppingCart[productInCartIndex]["product"] = product;
    lShoppingCart[productInCartIndex]["inventory"] = iSelectedInventory;
    if (
      iSelectedInventory?.quantity !== 0 &&
      !isProductInCartValid(
        iSelectedInventory?.quantity,
        productInCart?.quantity
      )
    ) {
      lShoppingCart[productInCartIndex]["quantity"] =
        iSelectedInventory?.quantity;
    }
  };
  const deleteInvalidItems = (invalidKeys, lShoppingCart) => {
    for (const key of invalidKeys) {
      const invalidItemIndex = lShoppingCart?.findIndex((iProductInCart) => {
        return getCartItemKey(iProductInCart) === key;
      });

      if (invalidItemIndex !== -1) {
        lShoppingCart.splice(invalidItemIndex, 1);
      }
    }
  };
  const calculatePrice = (setPrice) => {
    let price = { totalPurePrice: 0, totalPrice: 0, totalOff: 0 };
    for (const productInCart of shoppingCart) {
      const quantity = productInCart?.quantity;
      const off = productInCart?.product?.offPercent || 0;
      const purePrice =
        productInCart?.itemType === "SET"
          ? productInCart?.price
          : productInCart?.inventory?.price;

      if (purePrice == null) {
        continue;
      }
      price.totalPurePrice += quantity * purePrice;
      price.totalPrice += quantity * (purePrice - (purePrice * off) / 100);
      price.totalOff = price.totalPurePrice - price.totalPrice;
    }
    setPrice(price);
  };
  const findProductInCart = (id, inventoryId) => {
    const productInCartIndex = shoppingCart?.findIndex(
      (iProductInCart) =>
        iProductInCart?.itemType !== "SET" &&
        iProductInCart?.product?.id === id &&
        iProductInCart.inventory?.id === inventoryId
    );

    if (productInCartIndex === -1) {
      return null;
    } else {
      return {
        productInCartIndex: productInCartIndex,
        productInCart: shoppingCart[productInCartIndex],
      };
    }
  };
  const findSetInCart = (productId, colorId) => {
    const productInCartIndex = shoppingCart?.findIndex(
      (iProductInCart) =>
        iProductInCart?.itemType === "SET" &&
        iProductInCart?.product?.id === productId &&
        iProductInCart?.color?.id === colorId
    );

    if (productInCartIndex === -1) {
      return null;
    }
    return {
      productInCartIndex: productInCartIndex,
      productInCart: shoppingCart[productInCartIndex],
    };
  };
  const subtractProductInCart = (productInCart) => {
    if (productInCart.productInCart.quantity <= 1) {
      deleteCartItem(productInCart?.productInCart);
    } else {
      setShoppingCart((prev) => {
        prev[productInCart.productInCartIndex].quantity -= 1;
        return JSON.parse(JSON.stringify(prev));
      });
    }
  };
  const isProductInCartValid = (quantity, quantitySelected) => {
    if (quantitySelected > quantity) {
      return false;
    }
    return true;
  };
  const deleteProductFromCart = (inventoryId) => {
    const productInCartIndex = shoppingCart?.findIndex(
      (iProductInCart) =>
        iProductInCart?.itemType !== "SET" &&
        iProductInCart.inventory?.id === inventoryId
    );

    if (productInCartIndex !== -1) {
      const removedItem = shoppingCart[productInCartIndex];
      trackEvent("REMOVE_FROM_CART", {
        productId: removedItem?.product?.id,
        metadata: { inventoryId: inventoryId },
      });
      setShoppingCart((prev) => {
        prev.splice(productInCartIndex, 1);
        return JSON.parse(JSON.stringify(prev));
      });
    }
  };
  const deleteCartItem = (item) => {
    const key = getCartItemKey(item);
    const productInCartIndex = shoppingCart?.findIndex(
      (iProductInCart) => getCartItemKey(iProductInCart) === key
    );

    if (productInCartIndex !== -1) {
      trackEvent("REMOVE_FROM_CART", {
        productId: item?.product?.id,
        metadata: { itemType: item?.itemType || "SIMPLE", key: key },
      });
      setShoppingCart((prev) => {
        const next = JSON.parse(JSON.stringify(prev));
        const idx = next.findIndex(
          (iProductInCart) => getCartItemKey(iProductInCart) === key
        );
        if (idx !== -1) {
          next.splice(idx, 1);
        }
        return next;
      });
    }
  };
  const sumProductInCart = (productInCart, productQuantity) => {
    setShoppingCart((prev) => {
      if (prev[productInCart.productInCartIndex].quantity >= productQuantity) {
        return prev;
      }

      prev[productInCart.productInCartIndex].quantity += 1;

      return JSON.parse(JSON.stringify(prev));
    });
  };
  const addToCart = (product, inventory) => {
    setShoppingCart((prev) => {
      const idx = prev.findIndex(
        (p) => p?.itemType !== "SET" && p?.inventory?.id === inventory?.id
      );
      if (idx !== -1) {
        const next = JSON.parse(JSON.stringify(prev));
        next[idx].quantity += 1;
        return next;
      }
      return [
        ...prev,
        { itemType: "SIMPLE", product: product, inventory: inventory, quantity: 1 },
      ];
    });
  };
  const addSetToCart = (product, color, quantity = 1) => {
    setShoppingCart((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const idx = next.findIndex(
        (p) =>
          p?.itemType === "SET" &&
          p?.product?.id === product?.id &&
          p?.color?.id === color?.colorId
      );
      if (idx !== -1) {
        next[idx].quantity += quantity;
        return next;
      }
      next.push({
        itemType: "SET",
        product: product,
        color: {
          id: color?.colorId,
          name: color?.name,
          hexCode: color?.hexCode,
        },
        quantity: quantity,
        price: color?.price,
        availableQuantity: color?.availableQuantity,
        setPriceIsManual: color?.isManual,
        setCalculatedPrice: color?.calculatedPrice,
        setComponents: color?.components || [],
      });
      return next;
    });
  };
  const addItemsToCart = (items) => {
    setShoppingCart((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      for (const item of items || []) {
        const idx = next.findIndex(
          (p) =>
            p.product?.id === item.product?.id &&
            p.inventory?.id === item.inventory?.id
        );
        if (idx !== -1) {
          next[idx].quantity += item.quantity;
        } else {
          next.push({
            product: item.product,
            inventory: item.inventory,
            quantity: item.quantity,
          });
        }
      }
      return next;
    });
  };

  useEffect(() => {
    try {
      setAccess(cookies?.access ? cookies?.access : null);
      setUser(cookies?.access ? jwtDecode(cookies?.access) : null);
    } catch (error) {
      removeCookie("access", { path: "/" });
    }
  }, []);
  useEffect(() => {
    document.body.classList.remove("overflow-hidden");
    window.scrollTo(0, 0);
  }, [url]);

  const userSetter = (access) => {
    setCookie("access", access, { path: "/" });

    setAccess(access);
    setUser(jwtDecode(access));
  };
  useEffect(() => {
    Axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
  }, [access]);

  const login = async (phoneNumber, setErrors, setToastList, setLoading) => {
    try {
      const response = await Axios.post(serverAddress + "auth/login", {
        phoneNumber: phoneNumber,
      });

      if (response.status === 200) {
        setPhoneNumber(phoneNumber);
        navigate("/verify");
      }
    } catch (error) {
      if (error.response) {
        setErrors(() => {
          return error.response.data.fieldErrors;
        });
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
    } finally {
      setLoading(false);
    }
  };
  const verify = async (
    phoneNumber,
    code,
    setErrors,
    setToastList,
    setLoading
  ) => {
    try {
      const response = await Axios.post(serverAddress + "auth/verify", {
        phoneNumber: phoneNumber,
        code: code,
      });

      if (response.status === 200) {
        if (response.data.success === true) {
          const data = response.data;
          userSetter(data.data);
          Axios.defaults.headers.common["Authorization"] =
            `Bearer ${data.data}`;
          try {
            const localCart =
              JSON.parse(localStorage.getItem("shoppingCart")) || [];
            const syncResponse = await syncCartWithServer(localCart, false);
            if (Array.isArray(syncResponse.data)) {
              skipNextSyncRef.current = true;
              setShoppingCart(syncResponse.data);
            }
          } catch (syncError) {}
        }
      }
    } catch (error) {
      if (error.response) {
        setErrors(() => {
          return error.response.data.fieldErrors;
        });
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
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    removeCookie("access", { path: "/" });
    setUser(null);
    setAccess(null);
    lastSyncedCartRef.current = JSON.stringify(shoppingCart);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        access: access,
        login: login,
        verify: verify,
        logout: logout,
        userSetter: userSetter,
        shoppingCart: shoppingCart,
        setShoppingCart: setShoppingCart,
        findProductInCart: findProductInCart,
        findSetInCart: findSetInCart,
        getCartItemKey: getCartItemKey,
        subtractProductInCart: subtractProductInCart,
        sumProductInCart: sumProductInCart,
        addToCart: addToCart,
        addSetToCart: addSetToCart,
        addItemsToCart: addItemsToCart,
        isProductInCartValid: isProductInCartValid,
        deleteProductFromCart: deleteProductFromCart,
        deleteCartItem: deleteCartItem,
        updateShoppingCart: updateShoppingCart,
        calculatePrice: calculatePrice,
        phoneNumber: phoneNumber,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export { AuthProvider };
export default AuthContext;
