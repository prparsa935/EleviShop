import { useNavigate } from "react-router";
import Button from "../Button/Button";
import Input from "../input/Input";
import AdminItemBox from "../adminitembox/AdminItemBox";
import productImageTest from "../../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp";
import SearchFilter from "../searchfilter/SearchFilter";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchProducts } from "../../api/productApi";
import SearchSkeleton from "../searchskeleton/SearchSkeleton";
import Loading from "../icons/Loading";
const AdminProductC = ({ handleDeleteItem }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [productList, setProductList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    console.log("meow");
    searchProducts(
      Object.fromEntries([...searchParams]),
      [],
      setProductList,
      1,
      setPage,
      setHasMore
    );
  }, [searchParams]);
  return (
    <div className="flex flex-col border ">
      {/* header */}
      <div className=" m-5 p-2 border-b flex flex-col  ">
        <div className="flex justify-between items-center">
          <div>
            <Button
              onClick={() => navigate("/admin/product/save")}
              size="xs"
              bgColor="bg-green-100"
              txtColor="text-green-800"
            >
              افزودن +
            </Button>
          </div>

          <div className="flex items-stretch">
            <div className="h-[30px]">
              <Input
                onChange={(e) =>
                  setSearchParams((prev) => {
                    prev.set("name", e.target.value);
                    return prev;
                  })
                }
                height="30px"
                inputclassName=""
              ></Input>
            </div>

            <div>
              <Button
                moreCss="border-r-0 rounded-r-none h-[30px] "
                bgColor="bg-sky-100"
                size="sm"
              >
                جست و جو
              </Button>
            </div>
          </div>
        </div>

        <div className="flex w-100 ">
          <SearchFilter></SearchFilter>
        </div>
      </div>
      <div className="">
        <InfiniteScroll
          dataLength={productList.length}
          next={() =>
            searchProducts(
              Object.fromEntries([...searchParams]),
              productList,
              setProductList,
              page,
              setPage,
              setHasMore
            )
          }
          hasMore={hasMore}
          loader={
            <div className="flex justify-center w-full">
              <Loading className="w-8 h-8"></Loading>
            </div>
          }
        >
          {productList?.map((product) => {
            return (
              <AdminItemBox
                onDelete={() => handleDeleteItem(product?.id)}
                onEdit={() => navigate(`admin/product/save?${product?.id}`)}
              >
                <div className="flex items-center">
                  <div>
                    <img className="w-[80px]" src={productImageTest}></img>
                  </div>
                  <h3 className=" lg:font-semibold">{product?.name}</h3>
                </div>
              </AdminItemBox>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};
export default AdminProductC;
