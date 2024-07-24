import React, { useEffect, useRef, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import axios from "axios";
import { serverAddress } from "../App";
import { useLocation, useNavigate } from "react-router-dom";
const AuthContext = React.createContext();
const AuthProvider = (props) => {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies("access");
  const [registerErrM, setregisterErrM] = useState(null);
  const [access, setAccess] = useState(
    cookies?.access ? cookies?.access : null
  );
  const [shoppingCart, setShoppingCart] = useState(
    JSON.parse(window.sessionStorage?.getItem("shoppingCart")) || []
  );
  const count = useRef(false);
  // error here
  const [user, setUser] = useState(
    cookies?.access ? jwtDecode(cookies?.access) : null
  );
  //   const [shoppingCartItems, setShoppingCartItems] = useState(null);
  const url = useLocation();
  // todo not first time
  useEffect(() => {
    console.log(shoppingCart);
    // window.sessionStorage.removeItem("shoppingCart");
    window.sessionStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  }, [shoppingCart]);
  const findProductInCart = (id, inventoryId) => {
    const productInCartIndex = shoppingCart?.findIndex(
      (iProductInCart) =>
        iProductInCart?.productId === id &&
        iProductInCart.inventoryId === inventoryId
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
    setShoppingCart((prev) => {
      if (productInCart.productInCart.quantity <= 1) {
        deleteProductFromCart(prev, productInCart.productInCartIndex);
      } else {
        prev[productInCart.productInCartIndex].quantity -= 1;
      }

      return JSON.parse(JSON.stringify(prev));
    });
  };
  const isProductInCartValid = (quantity,quantitySelected) => {
    console.log(quantitySelected)
    console.log(quantity)
    if (quantitySelected > quantity) {

      return false
    }
    return true
  };
  const deleteProductFromCart = (shoppingCartList, index) => {
    shoppingCartList.splice(index, 1);
    return shoppingCartList;
  };
  const sumProductInCart = (productInCart, productQuantity) => {
    setShoppingCart((prev) => {
      if (prev[productInCart.productInCartIndex].quantity >= productQuantity) {
        return prev;
      }
      console.log('hell')
      prev[productInCart.productInCartIndex].quantity += 1;

      return JSON.parse(JSON.stringify(prev));
    });
  };
  const addToCart = (productId, inventoryId) => {
    setShoppingCart((prev) => {
      return [
        ...prev,
        { productId: productId, inventoryId: inventoryId, quantity: 1 },
      ];
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
  //     const getShoppingCart=async()=>{
  //     const res=await axios.post(serverAddress+'userapi/shoppingcart',{
  //         Headers:{'Content-Type':'Application/json'}
  //     })
  //     if(res.status===200){
  //         console.log(res.data)
  //         setShoppingCartItems(res.data.productsInCart)

  //     }
  // }
  const register = async (firstName, lastName, email, username, password) => {
    // const response=await fetch('http://localhost:8000/api/register',{
    //     headers:{"Content-Type": 'application/json'},
    //     method:'POST',
    //     body:JSON.stringify({username:'prparsa'})

    // })
    try {
      console.log(firstName);
      const response = await axios.post(
        serverAddress + "registerApi",
        {
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        navigate("login");
      }
    } catch (error) {
      //   setLoginErr({ err: { message: "لطفا دوباره امتحان کنید" } });
    }
  };
  const login = async (username, password) => {
    try {
      const response = await axios.post(
        serverAddress + "login",
        { username: code, password: password },
        {
          headers: {
            "Content-Type": "Application/Json",
          },
        }
      );

      if (response.status === 200) {
        if (response.data.succsess === true) {
          const access = response.data.jwt;
          userSetter(access);
        }
        // else if (response.data.code === 105) {
        //   window.location.reload();
        // } else {
        //   setRegisterErr({ err: { message: response.data.err.message } });
        // }

        // localStorage.setItem('access',JSON.stringify(data))
      }
    } catch (error) {}

    // const response=await fetch('http://localhost:8000/userapi/login',{
    //     headers:{"content-type":"application/json"},
    //     method:"POST",
    //     body:JSON.stringify({"username":username,"password":password})
    // })
  };
  const logout = () => {
    removeCookie("access", { path: "/" });

    setUser(null);
    setAccess(null);
  };
  const shoppingCartSetter = (setShoppingCart) => {};

  return (
    <AuthContext.Provider
      value={{
        user: user,
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
        isProductInCartValid:isProductInCartValid,
        deleteProductFromCart:deleteProductFromCart

      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
export { AuthProvider };
export default AuthContext;
