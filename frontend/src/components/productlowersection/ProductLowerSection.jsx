import { useEffect, useState } from "react";
import fetchSingleItem from "../../api/fetchSingleItem";
import { fetchRelatedProducts } from "../../api/productApi";
import AddToCart from "../addtocart/AddToCart";
import Comments from "../Comments/Comments";
import HorizentalProductList from "../horizentalproductlist/HorizentalProductList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tab/Tab";
import { serverAddress } from "../../App";
import { useNavigate } from "react-router";
import schema from "../../schema/schema";

const ProductLowerSection = ({
  selectedSize,
  setSelectedSize,
  product,
  setCommentModalActive,
}) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [service, setService] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    fetchRelatedProducts(product?.id, product?.code, setRelatedProducts);
    console.log(product.type);
    console.log(product.service);
    if (product.type === "service") {
      fetchSingleItem("service/", product?.id, setService, setServiceLoading);
    } else if (product.type === "plate") {
      fetchSingleItem(
        "service/",
        product?.service?.id,
        setService,
        setServiceLoading
      );
    }
  }, [product]);
  useEffect(() => {
    console.log(service);
  }, [service]);
  return (
    <div className="flex flex-col gap-y-10">
      {product?.type !== "service" ? (
        <HorizentalProductList
          title={"سرویس"}
          products={[service]}
        ></HorizentalProductList>
      ) : (
        <></>
      )}

      <HorizentalProductList
        title={"اجزای سرویس"}
        products={service?.plates}
      ></HorizentalProductList>
      <div className="flex w-100 ">
        <Tabs
          activationMode={"manual"}
          defaultValue="properties"
          orientation="vertical"
          className="grow "
        >
          <TabsList
            className={
              "w-100 lg:justify-start justify-around sticky top-[96px] mb-8  "
            }
          >
            <TabsTrigger className={"lg:grow-0 grow"} value="introduction">
              معرفی
            </TabsTrigger>
            <TabsTrigger className={"lg:grow-0 grow"} value="properties">
              مشخصات
            </TabsTrigger>
            <TabsTrigger className={"lg:grow-0 grow"} value="comments">
              دیدگاه ها
            </TabsTrigger>
          </TabsList>
          <TabsContent data-state="active" value="introduction">
            <div className=" text-neutral-600 text-justify lg:text-base lg:leading-8 text-sm   !leading-6 font-medium mx-5">
              {product?.description}
            </div>
          </TabsContent>
          <TabsContent data-state="active" value="properties">
            <div className="flex lg:gap-x-72 lg:flex-row flex-col mx-10 ">
              <div className=" lg:text-xl text-base font-medium text-neutral-700 mb-5">
                مشخصات
              </div>
              <div className="flex flex-col gap-y-8 ">
                {schema[product?.type].map((attr) => {
                  return (
                    <div className="flex lg:text-base text-xs lg:justify-normal justify-between ">
                      <span className=" text-neutral-400 font-semibold w-36  ">
                        {attr.value}
                      </span>
                      <span>{product[attr.key]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          <TabsContent data-state="active" value="comments">
            <Comments
              product={product}
              setCommentModalActive={setCommentModalActive}
            />
          </TabsContent>
        </Tabs>
        <div>
          <div className="w-[333px] xl:block hidden mr-10">
            <AddToCart
              inventory={selectedSize?.value}
              product={product}
            ></AddToCart>
          </div>
        </div>
      </div>
      <HorizentalProductList
        title={"محصولات مرتبط"}
        product={relatedProducts}
      ></HorizentalProductList>
    </div>
  );
};
export default ProductLowerSection;
