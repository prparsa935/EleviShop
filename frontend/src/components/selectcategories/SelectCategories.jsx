import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/category";
import SelectCategoryList from "../selectcategorylist/SelectCategoryList";

const SelectCategories = ({ allwaysActive }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    getAllCategories(setCategories);
  }, []);
  return (
    <>
      <SelectCategoryList
        categories={categories}
        allwaysActive={allwaysActive}
        active={allwaysActive}
      />
    </>
  );
};
export default SelectCategories;
