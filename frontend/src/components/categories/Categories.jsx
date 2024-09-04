import Category from "../category/Category";
import categoriListApi from'../../jsons/categories.json'
const Categories = () => {
  return (
    <div className="flex gap-x-5 p-8 ">
      {categoriListApi?.map((categoryData)=>{
        return(
            <Category categoryData={categoryData}/>
        )
      })}
    </div>
  );
};
export default Categories;
