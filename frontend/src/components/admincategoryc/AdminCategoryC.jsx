import { useNavigate } from "react-router";
import Button from "../Button/Button";
import { useSearchParams } from "react-router-dom";
import SelectCategories from "../selectcategories/SelectCategories";

const AdminCategoryC = ({ setDeleteModalActive }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasCategory = !!searchParams.get("categoryId");
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-y-4">
      <div className="flex flex-wrap justify-between items-center gap-y-3 pb-4 border-b border-[var(--glass-border)]">
        <h2 className="text-lg font-bold text-[var(--color-white)]">مدیریت گروه های کالایی</h2>
        <div className="flex items-center gap-x-2">
          <Button
            onClick={() => navigate("/admin/category/save")}
            size="sm"
            bgColor="bg-bf-lighter-green"
            txtColor="text-bf-green"
            moreCss="cursor-pointer"
          >
            <i className="fa-solid fa-plus ml-1"></i>
            افزودن
          </Button>
          <button
            onClick={() => {
              if (hasCategory) {
                navigate(`/admin/category/save?eCategoryId=${searchParams.get("categoryId")}`);
              }
            }}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              hasCategory
                ? "bg-bf-lighter-sky hover:bg-bf-sky cursor-pointer"
                : "bg-[var(--color-383946)]"
            }`}
          >
            <i className={`fal fa-edit ${hasCategory ? "text-bf-sky" : "sub-txt-color"}`}></i>
          </button>
          <button
            onClick={() => {
              if (hasCategory) {
                setDeleteModalActive(true);
              }
            }}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              hasCategory
                ? "bg-bf-lighter-red hover:bg-bf-red cursor-pointer"
                : "bg-[var(--color-383946)]"
            }`}
          >
            <i className={`fa-solid fa-trash ${hasCategory ? "text-bf-red" : "sub-txt-color"}`}></i>
          </button>
        </div>
      </div>
      <div>
        <SelectCategories allwaysActive={true} />
      </div>
    </div>
  );
};
export default AdminCategoryC;
