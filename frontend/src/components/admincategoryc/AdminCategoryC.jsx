import { useNavigate } from "react-router";
import Button from "../Button/Button";
import Input from "../input/Input";
import AdminItemBox from "../adminitembox/AdminItemBox";
import categories from "../../jsons/categories.json";
import SelectCategoryList from "../selectcategorylist/SelectCategoryList";
import { useSearchParams } from "react-router-dom";
import SelectCategories from "../selectcategories/SelectCategories";

const AdminCategoryC = ({ setDeleteModalActive }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col border ">
      {/* header */}
      <div className=" m-5 p-2 border-b flex justify-between items-center">
        <div>
          <Button
            onClick={() => navigate("/admin/category/save")}
            size="xs"
            bgColor="bg-green-100"
            txtColor="text-green-800"
          >
            افزودن +
          </Button>
        </div>

        <div className="flex items-stretch">
          <div className="flex justify-around gap-x-4">
            <div className=" cursor-pointer">
              <i
                onClick={() => {
                  if (searchParams.get("categoryId")) {
                    navigate(
                      `/admin/category/save?eCategoryId=${searchParams.get(
                        "categoryId"
                      )}`
                    );
                  }
                }}
                class={
                  "fal fa-edit " +
                  (!searchParams.get("categoryId")
                    ? "text-slate-400"
                    : "text-sky-400")
                }
              ></i>
            </div>
            <div className=" cursor-pointer">
              <i
                onClick={() => {
                  if (searchParams.get("categoryId")) {
                    setDeleteModalActive(true);
                  }
                }}
                class={
                  "fa-solid fa-trash  " +
                  (!searchParams.get("categoryId")
                    ? "text-slate-400"
                    : "text-red-500")
                }
              ></i>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-10">
        <SelectCategories allwaysActive={true} />
      </div>
    </div>
  );
};
export default AdminCategoryC;
