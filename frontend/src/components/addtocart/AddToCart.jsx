import Tag from "../tag/Tag";
import Button from "../Button/Button";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";

const AddToCart = ({ className, product, inventory }) => {
  const {
    shoppingCart,
    findProductInCart,
    addToCart,
    sumProductInCart,
    subtractProductInCart,
    isProductInCartValid,
    deleteProductFromCart,
  } = useContext(AuthContext);
  const [productInCart, setProductInCart] = useState(null);
  useEffect(() => {
    setProductInCart(() => {
      const iProductInCart = findProductInCart(product?.id, inventory?.id);
      console.log(iProductInCart);
      if (iProductInCart === null) {
        console.log("not found in cart");
        return null;
      } else {
        if (
          isProductInCartValid(
            inventory?.quantity,
            iProductInCart.productInCart.quantity
          )
        ) {
          return iProductInCart;
        } else {
          console.log("wtf why are you here");
          console.log(iProductInCart);
          deleteProductFromCart(
            shoppingCart,
            iProductInCart.productInCartIndex
          );
        }
      }
    });
  }, [shoppingCart, inventory]);

  return (
    <div
      className={"lg:w-[333px] w-100 lg:static fixed bottom-0 bg-white z-30 "}
    >
      {/* add to cart */}
      <div className="border rounded-2xl flex flex-col p-3  gap-y-6 lg:ml-4">
        <div className="  flex font-semibold text-xs pb-4 border-b">
          <div className="mx-1  text-slate-400">رضایت از کالا</div>
          <div className="mx-1 font-semibold text-xs text-green-500">۹۰٪</div>
        </div>

        <div className="flex justify-between align-center">
          <i class="fa-regular fa-circle-exclamation text-slate-400"></i>
          <div className="flex flex-col ">
            <div className="flex align-bottom ">
              <span className="line-through mx-3 text-xs text-slate-400 flex items-center">
                ۲۳۰,۰۰۰
              </span>
              <Tag
                size="xs"
                bgColor="bg-red-500"
                txtColor="text-white"
                morCss=""
              >
                ۵۷٪
              </Tag>
            </div>
            <div className=" font-bold">
              <span className="mx-1  text-lg">۹۷,۰۰۰</span>
              <span>تومان</span>
            </div>
          </div>
        </div>
        <div className=" select-none">
          {!productInCart ? (
            <Button
              onClick={() => {
                addToCart(product, inventory);
              }}
              txtColor="text-white"
              bgColor="bg-rose-500"
              size="lg"
              moreCss="w-100"
              shape="rounded-2xl"
            >
              افرودن به سبد
            </Button>
          ) : (
            <div className="border rounded-md flex justify-between grow px-2 py-1 mt-4 gap-x-3 text-red-500 items-center w-20 font-semibold text-lg ">
              <span
                onClick={() => {
                  sumProductInCart(productInCart, inventory?.quantity);
                }}
                className=" cursor-pointer"
              >
                +
              </span>

              <span>{productInCart.productInCart.quantity}</span>

              <span
                onClick={() => {
                  subtractProductInCart(productInCart);
                }}
                className=" cursor-pointer"
              >
                -
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AddToCart;
