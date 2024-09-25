const CategoryPath = ({ categoryPath }) => {
  return (
    <div className="w-100 flex font-semibold text-xs text-slate-400 px-5">
      {categoryPath?.map((category, index) => (
        <>
          {index === 0 ? "" : <div className="mx-3">/</div>}

          <div className=" cursor-pointer">{category}</div>
        </>
      ))}
    </div>
  );
};
export default CategoryPath;
