import { useEffect, useState } from "react";
import { searchProducts } from "../../api/productApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchSkeleton from "../searchskeleton/SearchSkeleton";
import { imageServerAddress } from "../../App";
import { formatNumber } from "../../utils/helperMehods";
import SmartImage from "../smartimage/SmartImage";
import Tag from "../tag/Tag";
import { trackEvent } from "../../hooks/useAnalytics";

const SearchProductList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [productList, setProductList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    const query = searchParams.get("name");
    if (categoryId) {
      trackEvent("CATEGORY_VIEW", { categoryId: Number(categoryId) });
    }
    if (query) {
      trackEvent("SEARCH", { searchQuery: query });
    }
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
    <div className="grow">
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
        loader={<SearchSkeleton></SearchSkeleton>}
        className="h-96  grow lg:mr-5 grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 "
      >
        {productList?.map((product, index) => (
          <div
            onClick={() => navigate("/product/" + product.id)}
            className="flex flex-col p-3 gap-y-3 glass glass-hover rounded-2xl cursor-pointer"
          >
            <div className="mx-auto mt-4">
              <SmartImage
                className="h-[240px] w-[240px] object-cover rounded-xl"
                src={imageServerAddress + product?.mainImage?.filePath}
                alt={product?.name}
                ratio="1/1"
              />
            </div>
            <div className="h-[72px] overflow-hidden font-medium  text-xs text-[var(--sub-text-color)] !leading-7 ">
              {product?.name}
            </div>
            <div className="flex justify-between items-center ">

              <div className="text-xs">
                <span className="mx-2 font-bold text-[var(--color-white)]">۴.۴</span>
                <i class="fa-solid fa-star text-[var(--color-yellow)]"></i>
              </div>
            </div>
            <div className="flex flex-col  text-base font-bold text-[var(--color-white)] mb-2 h-10">
              <div className="flex justify-end items-center">
                {product?.offPercent ? (
                  <Tag size="xs" txtColor="text-white" bgColor={"bg-[var(--bf-red)]"}>
                    {formatNumber(product?.offPercent) + "%"}
                  </Tag>
                ) : (
                  <></>
                )}

                <div
                  className="data-[off=true]:line-through"
                  data-off={product?.offPercent !== 0}
                >
                  <span className="mx-1">
                    {formatNumber(product?.inventories?.[0]?.price)}
                  </span>
                  <span>تومان</span>
                </div>
              </div>
              {product?.offPercent !== 0 ? (
                <div className="flex justify-end ">
                  <span className="mx-1">
                    {formatNumber(
                      product?.inventories?.[0]?.price -
                        (product?.offPercent *
                          product?.inventories?.[0]?.price) /
                          100
                    )}
                  </span>
                  <span>تومان</span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};
export default SearchProductList;
