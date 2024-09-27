import React, { useEffect, useRef, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import Axios from "axios";
import { serverAddress } from "../App";
import { useLocation, useNavigate } from "react-router-dom";

import useDidUpdateEffect from "../hooks/useDidUpdateEffect";
const AuthContext = React.createContext();
const AuthProvider = (props) => {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies("access");
  const [registerErrM, setregisterErrM] = useState(null);
  const [access, setAccess] = useState(
    cookies?.access ? cookies?.access : null
  );
  const [shoppingCart, setShoppingCart] = useState(
    JSON.parse(localStorage?.getItem("shoppingCart")) || []
  );
  const count = useRef(false);
  // error here
  const [user, setUser] = useState(
    cookies?.access ? jwtDecode(cookies?.access) : null
  );
  //   const [shoppingCartItems, setShoppingCartItems] = useState(null);
  const url = useLocation();
  // todo not first time
  useDidUpdateEffect(() => {
    // window.localStorage.removeItem("shoppingCart");
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [shoppingCart]);

  const updateShoppingCart = async (setLoading) => {
    let invalidList = [];
    let lShoppingCart = JSON.parse(JSON.stringify(shoppingCart));
    try {
      // Set loading to true before starting the operation
      const checkPromises = shoppingCart.map(async (productInCart, index) => {
        return await checkItemInCart(
          productInCart,
          index,
          invalidList,
          lShoppingCart
        );
      });
      console.log("this");
      await Promise.all(checkPromises);
      console.log(invalidList);
      console.log(lShoppingCart);
      console.log("process ended"); // Wait for all checkItemInCart calls to complete
      deleteInvalidItems(invalidList,lShoppingCart);
      setShoppingCart(lShoppingCart)
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const checkItemInCart = async (
    productInCart,
    productInCartIndex,
    invalidList,
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
        invalidList.push(iSelectedInventory.id);
      }
    } else {
    }
  };
  const updateItemInCart = (
    productInCartIndex,
    productInCart,
    product,
    iSelectedInventory,
    lShoppingCart
  ) => {
    console.log(lShoppingCart);
    console.log(productInCartIndex);
    console.log(lShoppingCart[productInCartIndex]);
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
  const deleteInvalidItems = (invalidList, lShoppingCart) => {
    console.log("deleteing invalid shit");

    for (const invalidItemId of invalidList) {
      const invalidItemIndex = lShoppingCart?.findIndex((iProductInCart) => {
        return iProductInCart.inventory?.id === invalidItemId;
      });
      console.log(lShoppingCart);
      console.log(invalidItemIndex);

      lShoppingCart.splice(invalidItemIndex, 1);
    }
  };
  const calculatePrice = (setPrice) => {
    let price = { totalPurePrice: 0, totalPrice: 0, totalOff: 0 };
    for (const productInCart of shoppingCart) {
      const quantity = productInCart?.quantity;
      const off = productInCart?.product?.offPercent;
      const purePrice = productInCart?.product?.price;
      console.log(price);
      price.totalPurePrice += quantity * purePrice;
      price.totalPrice += quantity * (purePrice - (purePrice * off) / 100);
      price.totalOff = price.totalPurePrice - price.totalPrice;
    }
    setPrice(price);
  };
  const findProductInCart = (id, inventoryId) => {
    const productInCartIndex = shoppingCart?.findIndex(
      (iProductInCart) =>
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
  const subtractProductInCart = (productInCart) => {
    if (productInCart.productInCart.quantity <= 1) {
      console.log(productInCart);
      deleteProductFromCart(productInCart?.productInCart?.inventory?.id);
    } else {
      setShoppingCart((prev) => {
        prev[productInCart.productInCartIndex].quantity -= 1;
        return JSON.parse(JSON.stringify(prev));
      });
    }
  };
  const isProductInCartValid = (quantity, quantitySelected) => {
    console.log(quantitySelected);
    console.log(quantity);
    if (quantitySelected > quantity) {
      return false;
    }
    return true;
  };
  const deleteProductFromCart = (inventoryId) => {
    const productInCartIndex = shoppingCart?.findIndex(
      (iProductInCart) => iProductInCart.inventory?.id === inventoryId
    );
    console.log(shoppingCart);
    console.log(productInCartIndex);
    console.log(inventoryId);

    if (productInCartIndex !== -1) {
      setShoppingCart((prev) => {
        prev.splice(productInCartIndex, 1);
        return JSON.parse(JSON.stringify(prev));
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
      console.log([
        ...prev,
        { product: product, inventory: inventory, quantity: 1 },
      ]);
      return [...prev, { product: product, inventory: inventory, quantity: 1 }];
    });
  };

  useEffect(() => {
    // const authority=sessionStorage.getItem('Authority')
    try {
      // if(authority!==null){
      //     // sendcookie for method
      //     navigate('/transaction/verifytransaction?Authority='+authority)
      // }
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

  const register = async (
    email,
    username,
    password,
    confirmPassword,
    setErrors,
    setToastList,
    setLoading
  ) => {
    try {
      const response = await Axios.post(serverAddress + "auth/register", {
        email: email,
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      });

      if (response.status === 200) {
        navigate("login");
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
        // Something happened in setting up the request that triggered an Error
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
  const login = async (
    username,
    password,
    setErrors,
    setToastList,
    setLoading
  ) => {
    try {
      const response = await Axios.post(serverAddress + "auth/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        if (response.data.success === true) {
          const data = response.data;
          userSetter(data.data.jwt);
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
        // Something happened in setting up the request that triggered an Error
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
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        access: access,
        login: login,
        register: register,
        logout: logout,
        userSetter: userSetter,
        shoppingCart: shoppingCart,
        setShoppingCart: setShoppingCart,
        findProductInCart: findProductInCart,
        subtractProductInCart: subtractProductInCart,
        sumProductInCart: sumProductInCart,
        addToCart: addToCart,
        isProductInCartValid: isProductInCartValid,
        deleteProductFromCart: deleteProductFromCart,
        updateShoppingCart: updateShoppingCart,
        calculatePrice: calculatePrice,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export { AuthProvider };
export default AuthContext;
