import Tag from "../tag/Tag";
import Button from "../Button/Button";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router";
import { formatNumber } from "../../utils/helperMehods";
import { trackEvent } from "../../hooks/useAnalytics";

const AddToCart = ({
  product,
  inventory,
  colorOptions,
  selectedSetColor,
  setSelectedSetColor,
}) => {
  const {
    shoppingCart,
    findProductInCart,
    findSetInCart,
    addToCart,
    addSetToCart,
    sumProductInCart,
    subtractProductInCart,
    isProductInCartValid,
    deleteProductFromCart,
  } = useContext(AuthContext);
  const isSet = product?.type === "productSet";
  const setColors = colorOptions?.colors || [];
  const setHasNoCommonColor = colorOptions?.hasNoCommonColor === true;
  const displayPrice = isSet ? selectedSetColor?.price : inventory?.price;
  const availableQuantity = isSet
    ? selectedSetColor?.availableQuantity
    : inventory?.quantity;
  const handleAddSetToCart = () => {
    if (!selectedSetColor || !product) {
      return;
    }
    addSetToCart(product, selectedSetColor, 1);
    trackEvent("ADD_TO_CART", {
      productId: product?.id,
      metadata: {
        itemType: "SET",
        colorId: selectedSetColor?.colorId,
        quantity: 1,
      },
    });
  };
  const [productInCart, setProductInCart] = useState(null);
  const [setInCart, setSetInCart] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    setProductInCart(() => {
      const iProductInCart = findProductInCart(product?.id, inventory?.id);

      if (iProductInCart === null) {
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
          deleteProductFromCart(inventory?.id);
        }
      }
    });
  }, [shoppingCart, inventory]);
  useEffect(() => {
    if (!isSet || !selectedSetColor) {
      setSetInCart(null);
      return;
    }
    setSetInCart(findSetInCart(product?.id, selectedSetColor.colorId));
  }, [shoppingCart, selectedSetColor, product]);

  return (
    <div
      className={
        "lg:w-[333px] w-100 lg:static fixed bottom-0 glass-strong z-30 left-0 "
      }
    >
      {/* add to cart */}
      <div className="border border-[var(--glass-border)] rounded-2xl flex flex-col p-3 gap-y-6 lg:ml-4">
        <div className="flex font-semibold text-xs pb-4 border-b border-[var(--glass-border)]">
          <div className="mx-1 text-[var(--sub-text-color)]">رضایت از کالا</div>
          <div className="mx-1 font-semibold text-xs text-[var(--color-gold)]">۹۰٪</div>
        </div>

        <div className="flex justify-between align-center">
          <i className="fa-regular fa-circle-exclamation text-[var(--sub-text-color)]"></i>
          <div className="flex flex-col ">
            {product?.offPercent ? (
              <div className="flex align-bottom ">
                <span className="line-through mx-3 text-xs text-[var(--sub-text-color)] flex items-center">
                  {formatNumber(displayPrice)}
                </span>
                <Tag size="xs" bgColor="bg-[var(--bf-red)]" txtColor="text-white" morCss="">
                  {formatNumber(product?.offPercent)} %
                </Tag>
              </div>
            ) : (
              <></>
            )}

            <div className="font-bold text-[var(--color-white)]">
              <span className="mx-1 text-lg tracking-wide">
                {formatNumber(
                  ((100 - product?.offPercent) / 100) * displayPrice
                )}
              </span>
              <span>تومان</span>
            </div>
          </div>
        </div>
        <div className="flex gap-x-2 items-center">
          <i className="fa-regular fa-box text-[var(--sub-text-color)]"></i>
          <div className="text-sm font-semibold text-[var(--color-white)]">
            <span>هر ست شامل</span>
            <span> {formatNumber(product?.countPerProduct)} </span>
            <span>محصول می باشد </span>
          </div>
        </div>
        <div className="select-none flex flex-col ">
          {isSet ? (
            <div className="flex flex-col gap-y-3">
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {setColors.map((color) => (
                  <button
                    key={color.colorId}
                    type="button"
                    onClick={() => setSelectedSetColor(color)}
                    title={color.name}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedSetColor?.colorId === color.colorId
                        ? "border-[var(--color-gold)] scale-110"
                        : "border-[var(--glass-border)]"
                    }`}
                    style={{ backgroundColor: color.hexCode }}
                  ></button>
                ))}
              </div>
              {setHasNoCommonColor ? (
                <div className="text-xs text-[var(--bf-red)]">
                  این سرویس رنگ مشترکی بین قطعاتش ندارد و در حال حاضر قابل سفارش نیست
                </div>
              ) : (
                <div className="text-xs text-[var(--sub-text-color)]">
                  {availableQuantity === 0
                    ? "موجود نیست"
                    : availableQuantity < 5
                    ? `${availableQuantity} عدد موجود، بیشتر نیاز به تولید دارد`
                    : "موجود"}
                </div>
              )}
              {!setHasNoCommonColor && setInCart ? (
                <div className="border border-[var(--glass-border)] rounded-md flex justify-between grow px-2 py-1 gap-x-3 text-[var(--color-gold)] items-center w-20 font-semibold text-lg">
                  {setInCart.productInCart.quantity ===
                  selectedSetColor?.availableQuantity ? (
                    <div className="w-2"></div>
                  ) : (
                    <span
                      onClick={() => {
                        sumProductInCart(
                          setInCart,
                          selectedSetColor?.availableQuantity
                        );
                      }}
                      className="cursor-pointer"
                    >
                      +
                    </span>
                  )}

                  <span>{formatNumber(setInCart.productInCart.quantity)}</span>

                  <span
                    onClick={() => {
                      subtractProductInCart(setInCart);
                    }}
                    className="cursor-pointer"
                  >
                    -
                  </span>
                </div>
              ) : !setHasNoCommonColor && availableQuantity !== 0 ? (
                <Button
                  onClick={handleAddSetToCart}
                  txtColor="text-white"
                  bgColor="bg-[var(--color-gold)]"
                  size="lg"
                  moreCss="w-100"
                  shape="rounded-2xl"
                  hoverClass="hover:brightness-105"
                >
                  افزودن به سبد
                </Button>
              ) : (
                <></>
              )}
            </div>
          ) : !inventory ? (
            <div className="flex justify-center text-[var(--sub-text-color)] text-sm">
              لطفا سایز و رنگ را انتخاب کنید
            </div>
          ) : inventory?.quantity === 0 ? (
            <div className="flex justify-center text-[var(--bf-red)]">موجود نیست</div>
          ) : !productInCart ? (
            <Button
              onClick={() => {
                if (inventory?.quantity !== 0) {
                  addToCart(product, inventory);
                  trackEvent("ADD_TO_CART", {
                    productId: product?.id,
                    metadata: { price: inventory?.price, quantity: 1 },
                  });
                }
              }}
              txtColor="text-white"
              bgColor="bg-[var(--color-gold)]"
              size="lg"
              moreCss="w-100"
              shape="rounded-2xl"
              hoverClass="hover:brightness-105"
            >
              افزودن به سبد
            </Button>
          ) : (
            <div className="border border-[var(--glass-border)] rounded-md flex justify-between grow px-2 py-1 mt-4 gap-x-3 text-[var(--color-gold)] items-center w-20 font-semibold text-lg ">
              {productInCart.productInCart.quantity === inventory?.quantity ? (
                <div className="w-2"></div>
              ) : (
                <span
                  onClick={() => {
                    sumProductInCart(productInCart, inventory?.quantity);
                  }}
                  className="cursor-pointer"
                >
                  +
                </span>
              )}

              <span>{formatNumber(productInCart.productInCart.quantity)}</span>

              <span
                onClick={() => {
                  subtractProductInCart(productInCart);
                }}
                className="cursor-pointer"
              >
                -
              </span>
            </div>
          )}
          {productInCart || (isSet && setInCart) ? (
            <span
              onClick={() => navigate("/cart")}
              className="lg:hidden p-3 text-[var(--color-gold)] self-end font-semibold "
            >
              برو به سبد خرید
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
export default AddToCart;
