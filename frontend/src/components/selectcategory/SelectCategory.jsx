import { useState } from "react";
import SelectCategoryList from "../selectcategorylist/SelectCategoryList";
import { useSearchParams } from "react-router-dom";

const SelectCategory = ({ category }) => {
  const [active, setActive] = useState(false);
  const [searchParam, setSearchParam] = useSearchParams();
  const activeHandler = () => {
    if (active === false) {
      setActive(true);
    } else {
      setActive(false);
    }
  };
  return (
    <>
      <li className="flex items-center cursor-pointer">
        {category.childCategories.length !== 0 ? (
          <i
            onClick={activeHandler}
            data-active={active}
            className=" duration-200 fa-solid fa-angle-left px-2 data-[active=true]:-rotate-90"
          ></i>
        ) : (
          ""
        )}

        <div
          onClick={() =>
            setSearchParam((prev) => {
              prev.set("categoryId", category.id);
              return prev;
            })
          }
          className="grow flex justify-between items-center"
        >
          <span> {category.name}</span>
          {searchParam.get("categoryId") === String(category.id) ? (
            <i class="fa-solid fa-check text-sky-400"></i>
          ) : (
            ""
          )}
        </div>
      </li>
      <li>
        <SelectCategoryList
          categories={category.childCategories}
          active={active}
        ></SelectCategoryList>
      </li>
    </>
  );
};
export default SelectCategory;
