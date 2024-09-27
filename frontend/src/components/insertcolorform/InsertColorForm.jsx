import Input from "../input/Input";
import productImageTest from "../../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp";

import Button from "../Button/Button";
import formApiHandler from "../../api/form";
import Loading from "../icons/Loading";
import { useContext, useEffect, useRef, useState } from "react";
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

    // todo validation
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
    // todo declear product state and use useeffect([product])
  }, [searchParams.get("colorId")]);
  useDidUpdateEffect(existingColorFormSetter, [existingColor]);
  return (
    <form
      ref={form}
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
        bgColor="bg-rose-500"
        txtColor="text-white"
        shape="rounded-lg"
        disabled={loading}
      >
        {loading ? <Loading className="w-6 h-6"></Loading> : "ثبت رنگ"}
      </Button>
    </form>
  );
};
export default InsertColorForm;
