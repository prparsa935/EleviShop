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
  const [serviceLoading, setServiceLoading] = useState(true);
  const [service, setService] = useState();
  useEffect(() => {
    fetchRelatedProducts(product?.id, product?.code, setRelatedProducts);
    if (product?.type === "service") {
      fetchSingleItem("service/", product?.id, setService, setServiceLoading);
    } else if (product?.type === "plate") {
      fetchSingleItem("service/", product?.service?.id, setService, setServiceLoading);
    }
  }, [product]);
  useEffect(() => {
    console.log(service);
  }, [service]);

  return (
    <div className="flex flex-col gap-y-10">
      {product?.type !== "service" ? (
        <HorizentalProductList title={"سرویس"} products={[service]}></HorizentalProductList>
      ) : (
        <></>
      )}

      <div>
        <div className="flex items-center gap-x-2 mb-3 px-2">
          <span className="relative w-7 h-7 shrink-0">
            <span className="absolute inset-0 rounded-full border-2 border-[var(--bf-orange)]"></span>
            <span className="absolute inset-[6px] rounded-full border-2 border-[var(--bf-red)]"></span>
          </span>
          <h3 className="text-lg font-semibold text-[var(--color-white)]">اجزای سرویس</h3>
        </div>
        <HorizentalProductList products={service?.plates}></HorizentalProductList>
      </div>

      <div className="flex w-100 bg-[var(--color-productcolor)] rounded-3xl border border-[var(--border-color)] p-4">
        <Tabs activationMode={"manual"} defaultValue="properties" orientation="vertical" className="grow ">
          <TabsList className={"w-100 lg:justify-start justify-around sticky top-[96px] mb-8 border-b border-[var(--border-color)] "}>
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
                  <div key={i} className="flex lg:text-base text-xs lg:justify-normal justify-between border-b border-dashed border-[var(--border-color)] pb-2">
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