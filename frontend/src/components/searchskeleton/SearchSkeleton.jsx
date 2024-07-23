import Skeleton from "../skeleton/Skeleton";

const SearchSkeleton = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="flex flex-col p-3 gap-y-3 border border-slate-200  hover:shadow-lg cursor-pointer">
          <div className="mx-auto mt-4">
            <Skeleton className="h-[240px] w-[240px]"></Skeleton>
          </div>
          <Skeleton className="h-[10px] w-9/12   "></Skeleton>
          <Skeleton className="h-[10px] w-4/12   "></Skeleton>

          <div className="flex justify-between items-center ">
            <div className="text-xs">
              <Skeleton className="h-[10px] w-10   "></Skeleton>
            </div>
          </div>
          <div className="flex justify-end text-base font-bold text-slate-600 mb-2">
            <Skeleton className="h-[10px] w-24   "></Skeleton>
          </div>
        </div>
      ))}
    </>
  );
};
export default SearchSkeleton;
