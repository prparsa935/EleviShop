import { useEffect, useState } from "react";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";
import SearchFilter from "../components/searchfilter/SearchFilter";
import SearchProductList from "../components/searchproductlist/SearchProductList";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../api/productApi";
import Sheet from "../components/sheet/Sheet";
import Tag from "../components/tag/Tag";
// category
// min takhfif
// brand
//name
// price min max

const Search = () => {
  const [productList, setProductList] = useState([]);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    searchProducts(Object.fromEntries([...searchParams]), setProductList);
  }, [searchParams]);

  return (
    <div className="search-page">
      <NavBar />
      <MobileFooter />
      <Tag
        onClick={() => {
            setIsFilterSheetOpen(true)
        }}
        prefix={<i class="fa-solid fa-filter-list"></i>}
        border
        size={"sm"}
        morCss="mt-2 lg:hidden !font-medium"
      >
        فیلتر
      </Tag>
      <div className="container mx-auto max-w-screen-2xl flex  mt-5   ">
        {/* filter */}
        <div className="min-w-72 hidden lg:flex border">
          <SearchFilter />
        </div>
        <Sheet
          state={isFilterSheetOpen}
          setState={setIsFilterSheetOpen}
          className=" lg:hidden z-50 bg-white h-100"
        >
          <SearchFilter />
        </Sheet>

        <SearchProductList productList={productList} />
      </div>
    </div>
  );
};
export default Search;
