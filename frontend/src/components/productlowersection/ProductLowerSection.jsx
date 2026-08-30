import { useEffect, useState } from "react";
import fetchSingleItem from "../../api/fetchSingleItem";
import { fetchRelatedProducts } from "../../api/productApi";
import AddToCart from "../addtocart/AddToCart";
import Comments from "../Comments/Comments";
import HorizentalProductList from "../horizentalproductlist/HorizentalProductList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tab/Tab";
import schema from "../../schema/schema";

const ProductLowerSection = ({ selectedSize, setSelectedSize, product, setCommentModalActive }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productSetLoading, setProductSetLoading] = useState(true);
  const [productSet, setProductSet] = useState();
  useEffect(() => {
    fetchRelatedProducts(product?.id, product?.code, setRelatedProducts);
    if (product?.type === "productSet") {
      fetchSingleItem("productSet/", product?.id, setProductSet, setProductSetLoading);
    } else if (product?.type === "plate") {
      fetchSingleItem(
        "productSet/",
        product?.productSetItems?.[0]?.productSet?.id,
        setProductSet,
        setProductSetLoading
      );
    }
  }, [product]);
  useEffect(() => {
    console.log(productSet);
  }, [productSet]);

  return (
    <div className="flex flex-col gap-y-10">
      {product?.type !== "productSet" ? (
        <HorizentalProductList title={"سرویس"} products={[productSet]}></HorizentalProductList>
      ) : (
        <></>
      )}

      <div>
        <div className="flex items-center gap-x-2 mb-3 px-2">
          <span className="relative w-7 h-7 shrink-0">
            <span className="absolute inset-0 rounded-full border-2 border-[var(--color-gold)]"></span>
            <span className="absolute inset-[6px] rounded-full border-2 border-[var(--color-yellow)]"></span>
          </span>
          <h3 className="text-lg font-semibold text-[var(--color-white)]">اجزای سرویس</h3>
        </div>
        <HorizentalProductList products={productSet?.productSetItems?.map((item) => item.plate)}></HorizentalProductList>
      </div>

      <div className="flex w-100 glass rounded-3xl p-4">
        <Tabs activationMode={"manual"} defaultValue="properties" orientation="vertical" className="grow ">
          <TabsList className={"w-100 lg:justify-start justify-around sticky top-[96px] mb-8 border-b border-[var(--glass-border)] "}>
            <TabsTrigger className={"lg:grow-0 grow"} value="introduction">معرفی</TabsTrigger>
            <TabsTrigger className={"lg:grow-0 grow"} value="properties">مشخصات</TabsTrigger>
            <TabsTrigger className={"lg:grow-0 grow"} value="comments">دیدگاه ها</TabsTrigger>
          </TabsList>
          <TabsContent data-state="active" value="introduction">
            <div className="text-[var(--sub-text-color)] text-justify lg:text-base lg:leading-8 text-sm !leading-6 font-medium mx-5">
              {product?.description}
            </div>
          </TabsContent>
          <TabsContent data-state="active" value="properties">
            <div className="flex lg:gap-x-72 lg:flex-row flex-col mx-10 ">
              <div className="lg:text-xl text-base font-semibold text-[var(--color-white)] mb-5">مشخصات</div>
              <div className="flex flex-col gap-y-5 ">
                {schema[product?.type]?.map((attr, i) => (
                  <div key={i} className="flex lg:text-base text-xs lg:justify-normal justify-between border-b border-dashed border-[var(--glass-border)] pb-2">
                    <span className="text-[var(--sub-text-color)] font-semibold w-36">{attr.value}</span>
                    <span className="text-[var(--color-white)]">{product[attr.key]}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent data-state="active" value="comments">
            <Comments product={product} setCommentModalActive={setCommentModalActive} />
          </TabsContent>
        </Tabs>
        <div>
          <div className="w-[333px] xl:block hidden mr-10">
            <AddToCart inventory={selectedSize?.value} product={product}></AddToCart>
          </div>
        </div>
      </div>
      <HorizentalProductList title={"محصولات مرتبط"} product={relatedProducts}></HorizentalProductList>
    </div>
  );
};
export default ProductLowerSection;
