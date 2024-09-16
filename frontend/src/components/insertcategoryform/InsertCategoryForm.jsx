import SelectCategoryList from "../selectcategorylist/SelectCategoryList";
import categories from "../../jsons/categories.json";
import Input from "../input/Input";
import productImageTest from "../../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp";
import ASelectBox from "../selectbox/ASelectBox";
import SelectBox from "../selectbox/SelectBox";
import Button from "../Button/Button";
import { useSearchParams } from "react-router-dom";
import formApiHandler from "../../api/form";
import Loading from "../icons/Loading";
import { useEffect, useRef, useState } from "react";
import useDidUpdateEffect from "../../hooks/useDidUpdateEffect";
import fetchSingleItem from "../../api/fetchSingleItem";
const InsertCategoryForm = ({ errors, setToastList, setErrors }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [existingCategory, setExistingCategory] = useState(null);

  const form = useRef();

  const existingCategoryFormSetter = () => {
    try {
      const currentForm = form.current;
      currentForm.name.value = existingCategory.name;
      setSearchParams((prev) => {
        prev.set("eCategoryId", existingCategory.id);
        return prev;
      });
    } catch (error) {}
  };
  const submitFormHandler = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const categoryId = searchParams.get("categoryId");

    // todo validation
    setLoading(true);
    formApiHandler(
      searchParams.get("eCategoryId")
        ? "category/admin/update/" + searchParams.get("eCategoryId")
        : "category/admin/save",
      {
        name: name,
        parentId: categoryId,
      },
      setToastList,
      setErrors,
      setLoading
    );
  };
  useEffect(() => {
    fetchSingleItem(
      "category/id/",
      searchParams.get("eCategoryId"),
      setExistingCategory
    );
    // todo declear product state and use useeffect([product])
  }, [searchParams.get("eCategoryId")]);
  useDidUpdateEffect(existingCategoryFormSetter, [existingCategory]);
  return (
    <form
      ref={form}
      onSubmit={submitFormHandler}
      className="insert-product-form flex flex-col gap-y-10"
    >
      <div className="flex ">
        <div className="mx-2 self-start">
          <i class="fa-solid fa-2x fa-square-plus text-sky-400"></i>
        </div>

        <div className="grow flex flex-col gap-y-3">
          <div className=" text-lg font-semibold">انتخاب گروه پدر</div>
          <div className="mx-3">
            <SelectCategoryList categories={categories} />
          </div>
          {errors["parentId"] ? (
            errors["parentId"]
          ) : (
            <span className=" text-red-600 text-sm"></span>
          )}
        </div>
      </div>
      <div className="flex flex-col col-span-6 ">
        <div className="mb-2 font-medium text-sm !leading-3 ">
          <span className=" text-red-500 text-lg !leading-3 ">*</span>
          <span className="!leading-3">نام گروه کالایی</span>
        </div>
        <Input name="name" iMessage={errors?.name} />
      </div>

      <Button
        bgColor="bg-rose-500"
        txtColor="text-white"
        shape="rounded-lg"
        disabled={loading}
      >
        {loading ? <Loading className="w-6 h-6"></Loading> : " ثبت گروه کالایی"}
      </Button>
    </form>
  );
};
export default InsertCategoryForm;
