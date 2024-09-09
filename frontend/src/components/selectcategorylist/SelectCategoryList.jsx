import { useEffect, useState } from "react";
import SelectCategory from "../selectcategory/SelectCategory";
import { getAllCategories } from "../../api/category";

const SelectCategoryList = ({ active }) => {
  const [categories, setCategories] = useState(null);
  useEffect(() => {
    getAllCategories(setCategories);
  }, []);
  return (
    <ul
      data-active={active}
      className=" flex gap-y-3 flex-col text-base font-semibold data-[active=false]:h-0 overflow-hidden duration-200 "
    >
      {categories?.map((category) => {
        return <SelectCategory active={false} category={category} />;
      })}
    </ul>
  );
};
export default SelectCategoryList;
