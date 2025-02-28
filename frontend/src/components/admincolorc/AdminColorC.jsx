import { useNavigate } from "react-router";
import Button from "../Button/Button";
import Input from "../input/Input";
import AdminItemBox from "../adminitembox/AdminItemBox";
import { findColorByNamePaging } from "../../api/color";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../icons/Loading";

const AdminColorC = ({ handleDeleteItem }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [colorList, setColorList] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    findColorByNamePaging(
      searchParams.get("name"),
      [],
      setColorList,
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
            onClick={() => navigate("/admin/color/save")}
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
      <div className="">
        <InfiniteScroll
          dataLength={colorList?.length}
          next={() =>
            findColorByNamePaging(
              searchParams.get("name"),
              colorList,
              setColorList,
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
        ></InfiniteScroll>
        {colorList?.map((color, index) => {
          return (
            <AdminItemBox
              key={index}
              onDelete={() => handleDeleteItem(color?.id)}
              onEdit={() => navigate(`/admin/color/save?colorId=${color?.id}`)}
            >
              <div className="flex items-center gap-x-5">
                <div
                  style={{ backgroundColor: color?.hexCode }}
                  className=" w-8 h-8 rounded-full "
                ></div>
                <h3 className="">{color?.name}</h3>
              </div>
            </AdminItemBox>
          );
        })}
      </div>
    </div>
  );
};
export default AdminColorC;
