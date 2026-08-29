import { useCallback } from "react";
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
        <div className="flex flex-col col-span-4">
          <div className="mb-2 font-medium text-sm">
            <span className="text-red-500 text-lg">*</span>
            طول
          </div>
          <Input iMessage={errors?.height} name="height" />
        </div>
        <div className="flex flex-col col-span-4">
          <div className="mb-2 font-medium text-sm">
            <span className="text-red-500 text-lg">*</span>
            عرض
          </div>
          <Input iMessage={errors?.width} name="width" />
        </div>
        <div className="flex flex-col col-span-4">
          <div className="mb-2 font-medium text-sm">
            <span className="text-red-500 text-lg">*</span>
            وزن
          </div>
          <Input iMessage={errors?.weight} name="weight" />
        </div>
      </>
    );
  } else if (type === "service") {
    return (
      <>
        <div className="flex flex-col col-span-4">
          <div className="mb-2 font-medium text-sm">
            <span className="text-red-500 text-lg">*</span>
            شامل
          </div>
          <Input iMessage={errors?.contain} name="contain" />
        </div>
        <div className="flex flex-col col-span-4">
          <div className="mb-2 font-medium text-sm">
            <span className="text-red-500 text-lg">*</span>
            محصولات سرویس
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
