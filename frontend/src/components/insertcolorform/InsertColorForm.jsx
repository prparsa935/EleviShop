import Input from "../input/Input";
import Button from "../Button/Button";
import formApiHandler from "../../api/form";
import Loading from "../icons/Loading";
import { useEffect, useRef, useState } from "react";
import useDidUpdateEffect from "../../hooks/useDidUpdateEffect";
import fetchSingleItem from "../../api/fetchSingleItem";
import { useSearchParams } from "react-router-dom";

const InsertColorForm = ({ errors, setToastList, setErrors }) => {
  const [loading, setLoading] = useState(false);
  const [existingColor, setExistingColor] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const form = useRef();

  const existingColorFormSetter = () => {
    try {
      const currentForm = form.current;
      currentForm.name.value = existingColor.name;
      currentForm.hexCode.value = existingColor.hexCode;
    } catch (error) {}
  };
  const submitFormHandler = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const hexCode = e.target.hexCode.value;

    setLoading(true);
    formApiHandler(
      searchParams.get("colorId")
        ? "color/admin/update/" + searchParams.get("colorId")
        : "color/admin/save",
      {
        name: name,
        hexCode: hexCode,
      },
      setToastList,
      setErrors,
      setLoading
    );
  };
  useEffect(() => {
    fetchSingleItem("color/id/", searchParams.get("colorId"), setExistingColor);
  }, [searchParams.get("colorId")]);
  useDidUpdateEffect(existingColorFormSetter, [existingColor]);
  return (
    <form
      ref={form}
      onSubmit={submitFormHandler}
      className="flex flex-col gap-y-6"
    >
      <div className="glass rounded-2xl p-5 flex flex-col gap-y-4">
        <h2 className="text-lg font-bold text-[var(--color-white)]">ثبت رنگ جدید</h2>
        <div className="grid grid-cols-12 gap-x-4 gap-y-4">
          <div className="flex flex-col lg:col-span-6 col-span-12">
            <div className="mb-2 font-medium text-sm">
              <span className="text-red-500 text-lg">*</span>
              نام رنگ
            </div>
            <Input name="name" iMessage={errors?.name} />
          </div>
          <div className="flex flex-col lg:col-span-6 col-span-12">
            <div className="mb-2 font-medium text-sm">
              <span className="text-red-500 text-lg">*</span>
              انتخاب رنگ
            </div>
            <div className="flex items-center gap-x-3">
              <input
                name="hexCode"
                className="rounded-full w-14 h-14 border-2 border-[var(--glass-border)] cursor-pointer"
                type="color"
              />
              <span className="text-sm text-[var(--sub-text-color)]">کلیک برای انتخاب رنگ</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        bgColor="bg-[var(--color-gold)]"
        txtColor="text-white"
        shape="rounded-lg"
        disabled={loading}
        moreCss="cursor-pointer"
      >
        {loading ? <Loading className="w-6 h-6" /> : "ثبت رنگ"}
      </Button>
    </form>
  );
};
export default InsertColorForm;
