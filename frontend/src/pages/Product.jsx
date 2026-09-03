import CategoryPath from "../components/categorypath/CategoryPath";
import { useContext, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import ProductUpperSection from "../components/productuppersection/ProductUpperSection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/Carousel/Carousel";
import ProductImageShow from "../components/productimageshow/ProductImageShow";
import ProductLowerSection from "../components/productlowersection/ProductLowerSection";
import {
  fetchSingleProduct,
  fetchSetAvailableColors,
  fetchMoldPatternDetail,
} from "../api/productApi";
import PageLoading from "../components/pageloading/PageLoading";
import useDidUpdateEffect from "../hooks/useDidUpdateEffect";
import { trackEvent } from "../hooks/useAnalytics";
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

const buildColorOptionsForSize = (size) => {
  if (!size) return [];
  const colorMap = new Map();
  (size.inventories || []).forEach((inv) => {
    const key = inv.colorId ?? "default";
    const existing = colorMap.get(key);
    if (
      !existing ||
      (inv.quantity ?? 0) > (existing.inventory?.quantity ?? 0)
    ) {
      colorMap.set(key, {
        colorId: inv.colorId ?? null,
        name: inv.colorName ?? "پیش‌فرض",
        hexCode: inv.colorHex ?? null,
        inventory: inv,
      });
    }
  });
  return Array.from(colorMap.values());
};

const Product = () => {
  const [errors, setErrors] = useState([]);
  const [toastList, setToastList] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isPatternRoute = location.pathname.startsWith("/pattern/");
  const [imageSiderActive, setImageSiderActive] = useState(false);
  const { shoppingCart } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [patternDetail, setPatternDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState();
  const [commentModalActive, setCommentModalActive] = useState(false);
  const [commentsRefreshKey, setCommentsRefreshKey] = useState(0);
  const [setColorOptions, setSetColorOptions] = useState(null);
  const [selectedSetColor, setSelectedSetColor] = useState(null);
  const [selectedMoldSize, setSelectedMoldSize] = useState(null);
  const [selectedColorInv, setSelectedColorInv] = useState(null);

  useEffect(() => {
    setLoading(true);
    setSelectedMoldSize(null);
    setSelectedColorInv(null);
    if (isPatternRoute) {
      setProduct(null);
      fetchMoldPatternDetail(id, setPatternDetail, setLoading);
      trackEvent("PRODUCT_VIEW", { kind: "pattern" });
    } else {
      setPatternDetail(null);
      fetchSingleProduct(id, (data) => {
        if (data?.kind === "pattern") {
          // /product/:id served a mold-pattern detail (id belongs to a pattern,
          // not a product) — render it through the pattern route so specs and
          // comments work on the representative product
          navigate("/pattern/" + id, { replace: true });
        } else {
          setProduct(data);
        }
      }, setLoading);
      trackEvent("PRODUCT_VIEW", { productId: Number(id) });
    }
  }, [id, isPatternRoute]);

  useEffect(() => {
    if (product?.type === "productSet") {
      fetchSetAvailableColors(product.id, (data) => {
        setSetColorOptions(data);
        setSelectedSetColor(data?.colors?.length ? data.colors[0] : null);
      });
    } else {
      setSetColorOptions(null);
      setSelectedSetColor(null);
    }
  }, [product]);

  useEffect(() => {
    if (!isPatternRoute || !patternDetail) return;
    const sizes = patternDetail.sizes || [];
    const firstAvailable =
      sizes.find((size) =>
        (size.inventories || []).some((inv) => (inv.quantity ?? 0) > 0)
      ) ||
      sizes[0] ||
      null;
    setSelectedMoldSize(firstAvailable);
  }, [patternDetail, isPatternRoute]);

  useEffect(() => {
    if (!isPatternRoute || !selectedMoldSize) {
      setSelectedColorInv(null);
      return;
    }
    const options = buildColorOptionsForSize(selectedMoldSize);
    const firstInStock =
      options.find((option) => (option.inventory?.quantity ?? 0) > 0) ||
      options[0] ||
      null;
    setSelectedColorInv(firstInStock);
  }, [selectedMoldSize, isPatternRoute]);

  useDidUpdateEffect(() => {
    if (isPatternRoute) return;
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
      setSelectedSize({
        label: inventory.size?.sizeLabel ?? null,
        value: inventory,
      });
    } else if (lastAvailableInv) {
      setSelectedSize({
        label: lastAvailableInv.size?.sizeLabel ?? null,
        value: lastAvailableInv,
      });
    } else {
      setSelectedSize({
        label: product?.inventories?.[0]?.size?.sizeLabel ?? null,
        value: product?.inventories?.[0],
      });
    }
  }, [product]);

  const patternProduct = patternDetail
    ? {
        id: patternDetail.representativeProductId ?? patternDetail.id,
        type: "patternCard",
        name: patternDetail.name,
        description: patternDetail.description,
        material: patternDetail.material,
        code: patternDetail.code,
        offPercent: patternDetail.offPercent,
        rate: patternDetail.rate,
        rateCount: patternDetail.rateCount,
        commentCount: patternDetail.commentCount,
        buyerCount: patternDetail.buyerCount,
        countPerProduct: 1,
        mainImage: patternDetail.mainImage,
        images: patternDetail.images,
        mainCategory: patternDetail.mainCategory,
        inventories: selectedColorInv ? [selectedColorInv.inventory] : [],
        moldPatternId: patternDetail.id,
      }
    : null;
  const displayProduct = isPatternRoute ? patternProduct : product;
  const resolvedInventory = isPatternRoute
    ? selectedColorInv?.inventory
    : selectedSize?.value;
  const syntheticSelectedSize = isPatternRoute
    ? { label: selectedMoldSize?.sizeLabel, value: resolvedInventory }
    : selectedSize;
  const moldSizeOptions = (patternDetail?.sizes || []).map((size) => ({
    label: size.sizeLabel,
    value: size.sizeId,
    size,
  }));
  const inventoryColorOptions = isPatternRoute
    ? buildColorOptionsForSize(selectedMoldSize)
    : null;

  if (loading) {
    return <PageLoading></PageLoading>;
  }
  return (
    <div className="product-page app-bg min-h-screen">
      <NavBar />
      <div className=" sticky top-24 w-100 h-0 z-50 ">
        {toastList?.map((toast, toastIndex) => (
          <Alert key={toastIndex} duration={5000} type={toast.type}>
            {toast.message}
          </Alert>
        ))}
      </div>
      <ProductImageShow
        productImageList={displayProduct?.images}
        active={imageSiderActive}
        setActive={setImageSiderActive}
      ></ProductImageShow>
      <CommentModalForm
        setErrors={setErrors}
        errors={errors}
        product={displayProduct}
        setToastList={setToastList}
        commentModalActive={commentModalActive}
        setCommentModalActive={setCommentModalActive}
        onCommentSaved={() => setCommentsRefreshKey((key) => key + 1)}
      />
      <div className="flex flex-col gap-y-5 mt-7 mx-auto max-w-screen-2xl px-3">
        <CategoryPath categoryPath={displayProduct?.mainCategory?.categoryPath} />
        <ProductUpperSection
          selectedSize={syntheticSelectedSize}
          setSelectedSize={isPatternRoute ? () => {} : setSelectedSize}
          imageSiderActive={imageSiderActive}
          setImageSiderActive={setImageSiderActive}
          product={displayProduct}
          colorOptions={setColorOptions}
          selectedSetColor={selectedSetColor}
          setSelectedSetColor={setSelectedSetColor}
          moldSizeOptions={moldSizeOptions}
          selectedMoldSize={selectedMoldSize}
          onMoldSizeChange={setSelectedMoldSize}
          inventoryColorOptions={inventoryColorOptions}
          selectedColorInv={selectedColorInv}
          onColorInvChange={setSelectedColorInv}
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
          commentsRefreshKey={commentsRefreshKey}
          selectedSize={syntheticSelectedSize}
          setSelectedSize={isPatternRoute ? () => {} : setSelectedSize}
          product={displayProduct}
          colorOptions={setColorOptions}
          selectedSetColor={selectedSetColor}
          setSelectedSetColor={setSelectedSetColor}
        ></ProductLowerSection>
      </div>
      <div className="h-[200px] lg:hidden"></div>
    </div>
  );
};
export default Product;
