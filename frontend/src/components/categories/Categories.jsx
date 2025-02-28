import Category from "../category/Category";

import { useEffect, useState } from "react";
import { getAllCategories } from "../../api/category";
const Categories = () => {
  const [categories, setCategories] = useState(null);
  useEffect(() => {
    getAllCategories(setCategories);
  }, []);
  return (
    <div className="flex gap-x-5 p-8 ">
      {categories?.map((categoryData) => {
        return <Category  categoryData={categoryData} />;
      })}
    </div>
  );
};
export default Categories;
