import FilterCategory from "../filtercategory/FilterCategory";

const FilterCategoryList = ({ categories, active,className }) => {
  return (
    <ul
      data-active={active}
      className="mr-2 flex gap-y-3 flex-col text-base font-semibold data-[active=false]:h-0 overflow-hidden duration-200 "
    >
      {categories.map((category) => {
        return <FilterCategory active={false} category={category} />;
      })}
    </ul>
  );
};
export default FilterCategoryList;
