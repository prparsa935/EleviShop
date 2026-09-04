import Input from "../input/Input";
import Button from "../Button/Button";
import formApiHandler from "../../api/form";
import Loading from "../icons/Loading";
import { useEffect, useRef, useState } from "react";
import useDidUpdateEffect from "../../hooks/useDidUpdateEffect";
import fetchSingleItem from "../../api/fetchSingleItem";
import { useSearchParams } from "react-router-dom";
import SelectCategories from "../selectcategories/SelectCategories";

const InsertCategoryForm = ({ errors, setToastList, setErrors }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [existingCategory, setExistingCategory] = useState(null);

  const form = useRef();

  const existingCategoryFormSetter = () => {
    try {
      const currentForm = form.current;
      currentForm.name.value = existingCategory?.name;
      setSearchParams((prev) => {
        prev.set("eCategoryId", existingCategory?.id);
        prev.set("categoryId", existingCategory?.parentCategory?.id);
        return prev;
      });
    } catch (error) {}
  };
  const submitFormHandler = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const parentCategoryId = searchParams.get("categoryId");

    setLoading(true);
    formApiHandler(
      searchParams.get("eCategoryId")
        ? "category/admin/update/" + searchParams.get("eCategoryId")
        : "category/admin/save",
      {
        categoryname: name,
        parentCatId: parentCategoryId,
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
  }, [searchParams.get("eCategoryId")]);
  useDidUpdateEffect(existingCategoryFormSetter, [existingCategory]);
  return (
    <form
      ref={form}
      onSubmit={submitFormHandler}
      className="flex flex-col gap-y-6"
    >
      <div className="glass rounded-2xl p-5 flex flex-col gap-y-4">
        <div className="flex gap-x-4">
          <div className="self-start mt-1">
            <i className="fa-solid fa-2x fa-square-plus text-sky-400"></i>
          </div>
          <div className="grow flex flex-col gap-y-3">
            <div className="text-lg font-bold text-[var(--color-white)]">انتخاب گروه پدر</div>
            <div className="mx-1">
              <SelectCategories allwaysActive={true} />
            </div>
            {errors?.["parentId"] ? (
              <span className="text-red-600 text-sm">{errors["parentId"]}</span>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 flex flex-col gap-y-4">
        <h2 className="text-lg font-bold text-[var(--color-white)]">نام گروه کالایی</h2>
        <div className="flex flex-col">
          <div className="mb-2 font-medium text-sm">
            <span className="text-red-500 text-lg">*</span>
            نام گروه کالایی
          </div>
          <Input name="name" iMessage={errors?.name} />
        </div>
      </div>

      <Button
        bgColor="bg-[var(--color-gold)]"
        txtColor="text-white"
        shape="rounded-lg"
        disabled={loading}
        moreCss="cursor-pointer"
      >
        {loading ? <Loading className="w-6 h-6" /> : "ثبت گروه کالایی"}
      </Button>
    </form>
  );
};
export default InsertCategoryForm;
