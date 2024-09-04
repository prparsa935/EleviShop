import Category from "../category/Category";

const CategoryList = ({ categoryListData }) => {
  return (
    <div className="flex flex-col ">
      {categoryListData?.map((categoryData) => {
        return <Category isSub={true} categoryData={categoryData} />;
      })}
    </div>
  );
};
export default CategoryList;
