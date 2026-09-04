import { useState } from "react";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";
import SearchFilter from "../components/searchfilter/SearchFilter";
import SearchProductList from "../components/searchproductlist/SearchProductList";
import { useNavigate } from "react-router-dom";
import Sheet from "../components/sheet/Sheet";
import Tag from "../components/tag/Tag";
// category
// min takhfif
//name
// price min max

const Search = () => {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="search-page app-bg min-h-screen">
      <NavBar />
      <MobileFooter />
      <div className="container mx-auto max-w-screen-2xl px-3 mt-3 flex items-center gap-3">
        <Tag
          onClick={() => navigate(-1)}
          prefix={<i className="fa-solid fa-arrow-right"></i>}
          border
          size={"sm"}
          morCss="glass lg:hidden !font-medium"
        >
          برگشت
        </Tag>
        <Tag
          onClick={() => {
            setIsFilterSheetOpen(true);
          }}
          prefix={<i className="fa-solid fa-filter-list"></i>}
          border
          size={"sm"}
          morCss="glass lg:hidden !font-medium"
        >
          فیلتر
        </Tag>
      </div>
      <div className="container mx-auto max-w-screen-2xl flex  mt-5 px-3  ">
        {/* filter */}
        <div className="min-w-72 hidden lg:flex">
          <SearchFilter />
        </div>
        <Sheet
          state={isFilterSheetOpen}
          setState={setIsFilterSheetOpen}
          className=" lg:hidden z-50 glass-strong h-100"
        >
          <SearchFilter />
        </Sheet>

        <SearchProductList />
      </div>
    </div>
  );
};
export default Search;
