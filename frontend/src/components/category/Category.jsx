import { useNavigate } from "react-router";
import Border from "../border/Border";
import CategoryList from "../categorylist/CategoryList";

const Category = ({ categoryData, isSub }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col w-56 ">
      <span
        onClick={() => navigate("/search?categoryId=" + categoryData.id)}
        className={
          "hover:bg-slate-200  cursor-pointer " +
          (categoryData.childCategories.length === 0
            ? "text-sm text-neutral-400 px-5 py-2 "
            : " text-lg p-2")
        }
      >
        {categoryData.name}
      </span>
      

      <CategoryList categoryListData={categoryData.childCategories} />
    </div>
  );
};
export default Category;
