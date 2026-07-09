import { useCallback, useEffect } from "react";
import Input from "../input/Input";
import schema from "../../schema/schema";
import { searchProducByNametWithCallback } from "../../api/productApi";
import ASelectBox from "../selectbox/ASelectBox";
const InsertProductAddAttr = ({
  errors,
  type,
  serviceProducts,
  setServiceProducts,
}) => {
  const handleServicePlatesChange = (selectedOptions) => {
    setServiceProducts(selectedOptions);
  };
  const loadProductOptions = useCallback(searchProducByNametWithCallback);
  if (type === "plate") {
    return (
      <>
        <div className="flex flex-col col-span-4 ">
          <div className="mb-2 font-medium text-sm !leading-3 ">
            <span className=" text-red-500 text-lg !leading-3 ">*</span>
            <span className="!leading-3">طول</span>
          </div>
          <Input iMessage={errors?.height} name="height" />
        </div>
        <div className="flex flex-col col-span-4 ">
          <div className="mb-2 font-medium text-sm !leading-3 ">
            <span className=" text-red-500 text-lg !leading-3 ">*</span>
            <span className="!leading-3">عرض</span>
          </div>
          <Input iMessage={errors?.width} name="width" />
        </div>
        <div className="flex flex-col col-span-4 ">
          <div className="mb-2 font-medium text-sm !leading-3 ">
            <span className=" text-red-500 text-lg !leading-3 ">*</span>
            <span className="!leading-3">وزن</span>
          </div>
          <Input iMessage={errors?.weight} name="weight" />
        </div>
      </>
    );
  } else if (type === "service") {
    return (
      <>
        <div className="flex flex-col col-span-4 ">
          <div className="mb-2 font-medium text-sm !leading-3 ">
            <span className=" text-red-500 text-lg !leading-3 ">*</span>
            <span className="!leading-3">شامل</span>
          </div>
          <Input iMessage={errors?.contain} name="contain" />
        </div>
        <div className="flex flex-col col-span-4 ">
          <div className="mb-2 font-medium text-sm !leading-3 ">
            <span className=" text-red-500 text-lg !leading-3 ">*</span>
            <span className="!leading-3">محصولات سرویس</span>
          </div>
          <ASelectBox
            loadOptions={loadProductOptions}
            isSearchable={true}
            name="productIds"
            isMulti={true}
            error={errors?.plateIds}
            onChange={handleServicePlatesChange}
            value={serviceProducts}
          />
        </div>
      </>
    );
  }
};
export default InsertProductAddAttr;
