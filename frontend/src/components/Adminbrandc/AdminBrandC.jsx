import { useNavigate } from "react-router";
import Button from "../Button/Button";
import Input from "../input/Input";
import AdminItemBox from "../adminitembox/AdminItemBox";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { findBrandByNamePaging } from "../../api/brand";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../icons/Loading";

const AdminBrandC = ({ handleDeleteItem }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [brandList, setBrandList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    findBrandByNamePaging(
      searchParams.get("name"),
      [],
      setBrandList,
      1,
      setPage,
      setHasMore
    );
  }, [searchParams]);

  return (
    <div className="flex flex-col border ">
      {/* header */}
      <div className=" m-5 p-2 border-b flex justify-between items-center">
        <div>
          <Button
            onClick={() => navigate("/admin/brand/save")}
            size="xs"
            bgColor="bg-green-100"
            txtColor="text-green-800"
          >
            افزودن +
          </Button>
        </div>
        <div className="flex items-stretch">
          <div className="h-[30px]">
            <Input
              onChange={(e) =>
                setSearchParams((prev) => {
                  prev.set("name", e.target.value);
                  return prev;
                })
              }
              height="30px"
              inputclassName=""
            ></Input>
          </div>

          <div>
            <Button
              moreCss="border-r-0 rounded-r-none h-[30px] "
              bgColor="bg-sky-100"
              size="sm"
            >
              جست و جو
            </Button>
          </div>
        </div>
      </div>
      <div>
        <InfiniteScroll
          dataLength={brandList.length}
          next={() =>
            findBrandByNamePaging(
              searchParams.get("name"),
              brandList,
              setBrandList,
              page,
              setPage,
              setHasMore
            )
          }
          hasMore={hasMore}
          loader={
            <div className="flex justify-center w-full">
              <Loading className="w-8 h-8"></Loading>
            </div>
          }
        >
          {brandList?.map((brand) => {
            return (
              <AdminItemBox
                onDelete={() => handleDeleteItem(brand?.id)}
                onEdit={() => navigate(`admin/brand/save?${brand?.id}`)}
              >
                <div className="flex">
                  <h3 className=" font-semibold mx-4">{brand?.name}</h3>
                  <span className="mx-5 h-20 overflow-hidden text-justify">
                    {brand?.explanation}
                  </span>
                </div>
              </AdminItemBox>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};
export default AdminBrandC;
