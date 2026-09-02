import Category from "../category/Category";

const CategoryList = ({ categoryListData }) => {
  return (
    <div className="flex flex-col ">
      {categoryListData?.map((categoryData) => {
        return (
          <Category key={categoryData.id} isSub={true} categoryData={categoryData} />
        );
      })}
    </div>
  );
};
export default CategoryList;
