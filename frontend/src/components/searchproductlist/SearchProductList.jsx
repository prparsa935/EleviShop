import { useEffect, useState } from "react";
import productImageTest from "../../assets/img/0a099b45d73a6607595ec7f1e39c5d3f1a08a2e6_1620035268.webp";
import { searchProducts } from "../../api/productApi";
import { useSearchParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../icons/Loading";
import SearchSkeleton from "../searchskeleton/SearchSkeleton";

const SearchProductList = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [productList, setProductList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    console.log("meow")
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
      next={()=>searchProducts(
          Object.fromEntries([...searchParams]),
          productList,
          setProductList,
          page,
          setPage,
          setHasMore
        )}
        hasMore={hasMore}
        loader={ <SearchSkeleton></SearchSkeleton> }
        className="h-96  grow lg:mr-5 grid grid-cols-1 xl:grid-cols-4 md:grid-cols-3 "
      >
        {productList?.map((product, index) => (
          <div className="flex flex-col p-3 gap-y-3 border border-slate-200  hover:shadow-lg cursor-pointer">
            <div className="mx-auto mt-4">
              <img className="h-[240px] w-[240px]" src={productImageTest} />
            </div>
            <div className="h-[72px] overflow-hidden font-medium  text-xs text-slate-700 !leading-7 ">
              {product?.name}
            </div>
            <div className="flex justify-between items-center ">
              {/* {product?.inventories[0]?.quantity < 5 ? (
                <div className="text-red-600 text-xs font-medium ">
                  تنها {product?.inventories[0]?.quantity} عدد در انبار باقی مانده
                </div>
              ) : (
                ""
              )} */}

              <div className="text-xs">
                <span className="mx-2 font-bold text-slate-800">۴.۴</span>
                <i class="fa-duotone fa-star text-amber-600"></i>
              </div>
            </div>
            <div className="flex justify-end text-base font-bold text-slate-600 mb-2">
              <span className="mx-1">۶۴,۰۰۰,۰۰۰</span>
              <span>تومان</span>
            </div>
          </div>
        ))}
        
      </InfiniteScroll>
     
      </div>
    
 
  );
};
export default SearchProductList;
