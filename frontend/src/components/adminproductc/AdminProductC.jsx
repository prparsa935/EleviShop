import { useNavigate } from "react-router";
import Button from "../Button/Button";
import Input from "../input/Input";
import AdminItemBox from "../adminitembox/AdminItemBox";
import SearchFilter from "../searchfilter/SearchFilter";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchProducts } from "../../api/productApi";
import Loading from "../icons/Loading";
import { imageServerAddress } from "../../App";
import SmartImage from "../smartimage/SmartImage";

const AdminProductC = ({ handleDeleteItem }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [productList, setProductList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
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
    <div className="glass rounded-2xl p-5 flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-3 pb-4 border-b border-[var(--glass-border)]">
        <div className="flex flex-wrap justify-between items-center gap-y-3">
          <h2 className="text-lg font-bold text-[var(--color-white)]">مدیریت کالاها</h2>
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
                placeHolder="نام کالا"
              />
            </div>
            <Button
              moreCss="border-r-0 rounded-r-none h-[30px] cursor-pointer"
              bgColor="bg-[var(--color-gold-light)]"
              txtColor="gold-text"
              size="sm"
            >
              جست و جو
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-y-3">
          <Button
            onClick={() => navigate("/admin/product/save")}
            size="sm"
            bgColor="bg-bf-lighter-green"
            txtColor="text-bf-green"
            moreCss="cursor-pointer"
          >
            <i className="fa-solid fa-plus ml-1"></i>
            افزودن کالا
          </Button>
          <SearchFilter />
        </div>
      </div>
      <div>
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
            <div className="flex justify-center w-full py-4">
              <Loading className="w-8 h-8"></Loading>
            </div>
          }
        >
          {productList?.map((product, index) => {
            return (
              <AdminItemBox
                key={index}
                onDelete={() => handleDeleteItem(product?.id)}
                onEdit={() =>
                  navigate(
                    `/admin/product/save?productId=${product?.productId || product?.id}`
                  )
                }
              >
                <div className="flex items-center gap-x-3">
                  <SmartImage
                    className="w-[60px] rounded-lg"
                    src={imageServerAddress + product?.mainImage.filePath}
                    alt={product?.name}
                    ratio="1/1"
                  />
                  <h3 className="font-semibold text-[var(--color-white)]">{product?.name}</h3>
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
