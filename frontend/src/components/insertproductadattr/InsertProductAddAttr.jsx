import { useCallback } from "react";
import Input from "../input/Input";
import ASelectBox from "../selectbox/ASelectBox";
import { searchProducByNametWithCallback } from "../../api/productApi";

const InsertProductAddAttr = ({
  errors,
  type,
  setItems,
  setSetItems,
  containValue,
  onContainChange,
}) => {
  const loadProductOptions = useCallback(searchProducByNametWithCallback);
  const handleSetPlatesChange = (selectedOptions) => {
    const selected = selectedOptions || [];
    setSetItems((prev) => {
      const prevMap = new Map((prev || []).map((item) => [item.value, item]));
      return selected.map((opt) => ({
        ...opt,
        quantity: prevMap.get(opt.value)?.quantity ?? 1,
      }));
    });
  };
  const handleSetItemQuantityChange = (plateId, quantity) => {
    setSetItems((prev) =>
      (prev || []).map((item) =>
        item.value === plateId
          ? { ...item, quantity: quantity >= 1 ? quantity : 1 }
          : item
      )
    );
  };
  if (type !== "productSet") {
    return null;
  }
  return (
    <>
      <div className="flex flex-col col-span-4">
        <div className="mb-2 font-medium text-sm">
          <span className="text-red-500 text-lg">*</span>
          شامل
        </div>
        <Input
          iMessage={errors?.contain}
          name="contain"
          value={containValue}
          onChange={onContainChange}
        />
      </div>
      <div className="flex flex-col col-span-12">
        <div className="mb-2 font-medium text-sm">
          <span className="text-red-500 text-lg">*</span>
          محصولات ست
        </div>
        <ASelectBox
          loadOptions={loadProductOptions}
          isSearchable={true}
          name="productIds"
          isMulti={true}
          error={errors?.items}
          onChange={handleSetPlatesChange}
          value={setItems}
        />
      </div>
      {(setItems || []).map((item) => (
        <div key={item.value} className="flex flex-col col-span-3">
          <div className="mb-2 font-medium text-sm">
            <span className="text-red-500 text-lg">*</span>
            تعداد {item.label}
          </div>
          <Input
            name={`setItemQuantity_${item.value}`}
            type="number"
            value={item.quantity ?? 1}
            onChange={(e) =>
              handleSetItemQuantityChange(item.value, Number(e.target.value))
            }
          />
        </div>
      ))}
    </>
  );
};
export default InsertProductAddAttr;
