import SelectCategoryList from "../selectcategorylist/SelectCategoryList";
import categories from "../../jsons/categories.json";
import Input from "../input/Input";
import productImageTest from "../../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp";
import ASelectBox from "../selectbox/ASelectBox";
import SelectBox from "../selectbox/SelectBox";
import Button from "../Button/Button";
const InsertCategoryForm = () => {
  return (
    <form className="insert-product-form flex flex-col gap-y-10">
      <div className="flex ">
        <div className="mx-2 self-start">
          <i class="fa-solid fa-2x fa-square-plus text-sky-400"></i>
        </div>

        <div className="grow flex flex-col gap-y-3">
          <div className=" text-lg font-semibold">انتخاب گروه پدر</div>
          <div className="mx-3">
            <SelectCategoryList categories={categories} />
          </div>
        </div>
      </div>
      <div className="flex flex-col col-span-6 ">
        <div className="mb-2 font-medium text-sm !leading-3 ">
          <span className=" text-red-500 text-lg !leading-3 ">*</span>
          <span className="!leading-3">نام گروه کالایی</span>
        </div>
        <Input />
      </div>
      <Button
        bgColor={"bg-sky-100"}
        txtColor={"text-sky-800"}
        moreCss={"border-sky-400"}
      >
        ثبت گروه کالایی
      </Button>
    </form>
  );
};
export default InsertCategoryForm;
