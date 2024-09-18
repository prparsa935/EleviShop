import AddToCart from "../addtocart/AddToCart";
import HorizentalProductList from "../horizentalproductlist/HorizentalProductList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tab/Tab";

const ProductLowerSection = ({ selectedSize,
  setSelectedSize, product }) => {
  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex w-100 ">
        <Tabs
          activationMode={"manual"}
          defaultValue="tab2"
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
            <TabsTrigger className={"lg:grow-0 grow"} value="tab3">
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
                <div className="flex lg:text-base text-xs lg:justify-normal justify-between ">
                  <span className=" text-neutral-400 font-semibold w-36  ">
                    جنس
                  </span>
                  <span>{product?.material}</span>
                </div>
                <div className="flex  lg:text-base text-xs lg:justify-normal justify-between ">
                  <span className=" text-neutral-400 font-semibold  w-36 ">
                    طرح
                  </span>
                  <span>{product?.pattern}</span>
                </div>
                <div className="flex  lg:text-base text-xs lg:justify-normal justify-between">
                  <span className=" text-neutral-400 font-semibold w-36 ">
                    قد
                  </span>
                  <span>{product?.height}</span>
                </div>
   
              </div>
            </div>
          </TabsContent>
          <TabsContent data-state="active" value="tab3">
            Tab three content
          </TabsContent>
        </Tabs>
        <div>
          <div className="w-[333px] xl:block hidden mr-10">
            <AddToCart inventory={selectedSize?.value} product={product}></AddToCart>
          </div>
        </div>
      </div>
      <HorizentalProductList product={product}></HorizentalProductList>
    </div>
  );
};
export default ProductLowerSection;
