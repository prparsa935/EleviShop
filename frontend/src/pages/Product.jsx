import CategoryPath from "../components/categorypath/CategoryPath";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import ProductUpperSection from "../components/productuppersection/ProductUpperSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/Carousel/Carousel";
import ProductImageShow from "../components/productimageshow/ProductImageShow";
import ProductLowerSection from "../components/productlowersection/ProductLowerSection";
import { fetchSingleProduct } from "../api/productApi";
import PageLoading from "../components/pageloading/PageLoading";
import useDidUpdateEffect from "../hooks/useDidUpdateEffect";
import AuthContext from "../context/AuthContext";
import CommentModalForm from "../components/commentmodalform/CommentModalForm";
import Alert from "../components/alert/Alert";

const advantages = [
  { icon: "fa-shipping-fast", label: "امکان تحویل سریع" },
  { icon: "fa-user-headset", label: "پشتیبانی ۲۴ ساعته" },
  { icon: "fa-credit-card", label: "امکان تحویل درب منزل" },
  { icon: "fa-repeat", label: "هفت روز ضمانت بازگشت" },
  { icon: "fa-badge-check", label: "ضمانت اصل بودن کالا" },
];

const Product = () => {
  const [errors, setErrors] = useState([]);
  const [toastList, setToastList] = useState([]);
  const { id } = useParams();
  const [imageSiderActive, setImageSiderActive] = useState(false);
  const { shoppingCart } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState();
  const [commentModalActive, setCommentModalActive] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSingleProduct(id, setProduct, setLoading);
  }, [id]);
  useDidUpdateEffect(() => {
    let lastAvailableInv = null;
    const inventory = product?.inventories?.find((inventory) => {
      const productInCartIndex = shoppingCart.findIndex((productInCart) => {
        return productInCart.inventory?.id === inventory?.id;
      });
      if (inventory.quantity !== 0) {
        lastAvailableInv = inventory;
      }
      return productInCartIndex !== -1;
    });
    if (inventory) {
      setSelectedSize({ label: inventory.size, value: inventory });
    } else if (lastAvailableInv) {
      setSelectedSize({ label: lastAvailableInv.size, value: lastAvailableInv });
    } else {
      setSelectedSize({
        label: product?.inventories[0]?.size,
        value: product?.inventories[0],
      });
    }
  }, [product]);

  if (loading) {
    return <PageLoading></PageLoading>;
  }
  return (
    <div className="product-page app-bg min-h-screen">
      <NavBar />
      <div className=" sticky top-24 w-100 h-0 z-50 ">
        {toastList?.map((toast) => (
          <Alert duration={5000} type={toast.type}>
            {toast.message}
          </Alert>
        ))}
      </div>
      <ProductImageShow
        productImageList={product?.images}
        active={imageSiderActive}
        setActive={setImageSiderActive}
      ></ProductImageShow>
      <CommentModalForm
        setErrors={setErrors}
        product={product}
        setToastList={setToastList}
        commentModalActive={commentModalActive}
        setCommentModalActive={setCommentModalActive}
      />
      <div className="flex flex-col gap-y-5 mt-7 mx-auto max-w-screen-2xl px-3">
        <CategoryPath categoryPath={product?.mainCategory?.categoryPath} />
        <ProductUpperSection
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          imageSiderActive={imageSiderActive}
          setImageSiderActive={setImageSiderActive}
          product={product}
        ></ProductUpperSection>

        <div className="w-100 my-6 rounded-3xl glass py-6 px-3">
          <Carousel
            opts={{ direction: "rtl", dragFree: true }}
            className="w-100 h-14 m-auto relative select-none cursor-pointer"
          >
            <CarouselContent className={"h-100 justify-center align-baseline"}>
              {advantages.map((item, index) => (
                <CarouselItem key={index} className={"lg:basis-1/5 basis-1/3"}>
                  <div className="flex justify-center text-[var(--sub-text-color)] lg:text-sm text-xs flex-col lg:flex-row font-medium items-center gap-x-3 gap-y-3">
                    <span className="flex items-center justify-center w-11 h-11 rounded-full glass border border-[var(--glass-border)] text-[var(--color-gold)] shrink-0">
                      <i className={`far fa-lg ${item.icon}`}></i>
                    </span>
                    <span>{item.label}</span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <ProductLowerSection
          setToastList={setToastList}
          setCommentModalActive={setCommentModalActive}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          product={product}
        ></ProductLowerSection>
      </div>
      <div className="h-[200px]"></div>
    </div>
  );
};
export default Product;