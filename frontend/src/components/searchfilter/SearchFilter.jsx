import FilterCategoryList from "../filtercategorylist/FilterCategoryList";
import Switch from "../switch/Switch";
// import categories from "../../jsons/categories.json";
import { Slider } from "../slider/Slider";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/category";
const SearchFilter = () => {
  const [categories, setCategories] = useState();
  const [searchParms, setSearchParam] = useSearchParams();
  const [isOff, setIsOff] = useState(false);
  useEffect(() => {
    getAllCategories(setCategories);
  }, []);
  useEffect(() => {
    if (searchParms.get("enableOff") === "true") {
      setIsOff(true);
    } else {
      setIsOff(false);
    }
  }, [searchParms.get("enableOff")]);
  return (
    <div className="glass w-100 flex-col gap-y-8 p-6 rounded-2xl flex">
      <div className="flex justify-between items-center cursor-pointer">
        <h3 className=" text-xl font-semibold text-[var(--color-white)] cursor-pointer ">
          فیلتر ها
        </h3>
        <div
          className="gold-text text-xs font-bold cursor-pointer"
          onClick={() => {
            setSearchParam((prev) => {
              return [];
            });
          }}
        >
          حذف فیلتر ها
        </div>
      </div>

      <div className="flex flex-col ">
        <div className="flex justify-between items-center cursor-pointer w-100 mb-2">
          <h5 className=" text-sm font-medium text-[var(--color-white)]  ">دسته بندی</h5>
          <i class="fa-solid fa-angle-down ml-1 gold-text"></i>
        </div>
        <FilterCategoryList
          active={true}
          categories={categories}
        ></FilterCategoryList>
      </div>
      <div className="flex flex-col gap-y-3 ">
        <div className="flex justify-between items-center cursor-pointer ">
          <h5 className=" text-sm font-medium text-[var(--color-white)] ">محدوده قیمت</h5>
          <i class="fa-solid fa-angle-down ml-1 gold-text"></i>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between font-semibold text-[var(--color-white)]">
            <span>قیمت از</span>
            <span>{searchParms.get("minPrice")} تومان</span>
          </div>
          <div className="flex justify-between font-semibold text-[var(--color-white)]">
            <span>تا</span>
            <span>{searchParms.get("maxPrice")}تومان</span>
          </div>
        </div>
        <Slider
          defaultValue={[
            searchParms.get("minPrice") || 10000000,
            searchParms.get("maxPrice") || 500000,
          ]}
          max={10000000}
          step={1000}
          onValueCommit={(values) => {
            let max = null;
            let min = null;
            if (values.length === 2) {
              max = values[1];
              min = values[0];
            }
            setSearchParam((prev) => {
              prev.set("maxPrice", max);
              prev.set("minPrice", min);
              return prev;
            });
          }}
        />
      </div>
      <div className="flex justify-between items-center cursor-pointer">
        <h5 className=" text-sm font-semibold text-[var(--color-white)]  ">دارای تخفیف</h5>
        <Switch
          checked={isOff}
          onCheckedChange={(value) => {
            setSearchParam((prev) => {
              prev.set("enableOff", value);
              return prev;
            });
          }}
        ></Switch>
      </div>
    </div>
  );
};
export default SearchFilter;
