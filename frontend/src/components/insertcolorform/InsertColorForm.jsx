import SelectCategoryList from "../selectcategorylist/SelectCategoryList";
import categories from "../../jsons/categories.json";
import Input from "../input/Input";
import productImageTest from "../../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp";
import ASelectBox from "../selectbox/ASelectBox";
import SelectBox from "../selectbox/SelectBox";
import Button from "../Button/Button";
import formApiHandler from "../../api/form";
const InsertColorForm = ({ errors, setToastList, setErrors }) => {
  const submitFormHandler = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const hexCode = e.target.hexCode.value;

    // todo validation
    formApiHandler(
      "color/admin/save",
      {
        name: name,
        hexCode: hexCode,
      },
      setToastList,
      setErrors
    );
  };
  return (
    <form
      onSubmit={submitFormHandler}
      className="insert-product-form flex flex-col gap-y-10"
    >
      <div className=" grid grid-cols-12">
        <div className="flex flex-col col-span-6 ml-5 ">
          <div className="mb-2 font-medium text-sm !leading-3 ">
            <span className=" text-red-500 text-lg !leading-3 ">*</span>
            <span className="!leading-3">نام رنگ</span>
          </div>
          <Input name="name" iMessage={errors?.name} />
        </div>
        <div className="flex flex-col col-span-6 ">
          <div className="mb-2 font-medium text-sm !leading-3 ">
            <span className=" text-red-500 text-lg !leading-3 ">*</span>
            <span className="!leading-3">انخاب رنگ</span>
          </div>
          <input
            name="hexCode"
            className=" rounded-full w-12  h-12"
            type="color"
          />
        </div>
      </div>

      <Button
        bgColor={"bg-sky-100"}
        txtColor={"text-sky-800"}
        moreCss={"border-sky-400"}
      >
        ثبت رنگ
      </Button>
    </form>
  );
};
export default InsertColorForm;
