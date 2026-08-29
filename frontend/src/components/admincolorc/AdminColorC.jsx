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
    <div className="glass rounded-2xl p-5 flex flex-col gap-y-4">
      <div className="flex flex-wrap justify-between items-center gap-y-3 pb-4 border-b border-[var(--glass-border)]">
        <h2 className="text-lg font-bold text-[var(--color-white)]">مدیریت رنگ ها</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => navigate("/admin/color/save")}
            size="sm"
            bgColor="bg-bf-lighter-green"
            txtColor="text-bf-green"
            moreCss="cursor-pointer"
          >
            <i className="fa-solid fa-plus ml-1"></i>
            افزودن
          </Button>
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
                placeHolder="نام رنگ"
              />
            </div>
            <Button
              moreCss="border-r-0 rounded-r-none h-[30px] cursor-pointer"
              bgColor="bg-[var(--color-gold-light)]"
              txtColor="gold-text"
              size="sm"
            >
              جست و جو
            </Button>
          </div>
        </div>
      </div>
      <div>
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
            <div className="flex justify-center w-full py-4">
              <Loading className="w-8 h-8"></Loading>
            </div>
          }
        >
          {colorList?.map((color, index) => {
            return (
              <AdminItemBox
                key={index}
                onDelete={() => handleDeleteItem(color?.id)}
                onEdit={() => navigate(`/admin/color/save?colorId=${color?.id}`)}
              >
                <div className="flex items-center gap-x-4">
                  <div
                    style={{ backgroundColor: color?.hexCode }}
                    className="w-8 h-8 rounded-full border border-[var(--glass-border)]"
                  ></div>
                  <h3 className="font-semibold text-[var(--color-white)]">{color?.name}</h3>
                </div>
              </AdminItemBox>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
};
export default AdminColorC;
