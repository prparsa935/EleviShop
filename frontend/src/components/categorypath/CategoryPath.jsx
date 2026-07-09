const CategoryPath = ({ categoryPath }) => {
  return (
    <div className="w-100 flex font-semibold text-xs text-[var(--sub-text-color)] px-5">
      {categoryPath?.map((category, index) => (
        <>
          {index === 0 ? "" : <div className="mx-3 gold-text">/</div>}

          <div className=" cursor-pointer hover:gold-text transition-colors">{category}</div>
        </>
      ))}
    </div>
  );
};
export default CategoryPath;
