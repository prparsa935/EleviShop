import Input from "../input/Input";
import SelectBox from "../selectbox/SelectBox";
import { useCallback, useEffect, useRef, useState } from "react";
import { uploadImage } from "../../api/uploadImage";
import ProgressBar from "../progressbar/ProgressBar";
import { useSearchParams } from "react-router-dom";
import Button from "../Button/Button";
import formApiHandler from "../../api/form";
import {
  fetchSingleProduct,
  searchProducByNametWithCallback,
  calcSetPricePreview,
  fetchMolds,
  fetchPatterns,
  createMold,
  createMoldSize,
  createPattern,
  createMoldPatternLink,
} from "../../api/productApi";
import { formatNumber } from "../../utils/helperMehods";
import useDidUpdateEffect from "../../hooks/useDidUpdateEffect";
import Loading from "../icons/Loading";
import SelectCategories from "../selectcategories/SelectCategories";
import SmartImage from "../smartimage/SmartImage";
import { imageServerAddress } from "../../App";
import InsertProductAddAttr from "../insertproductadattr/InsertProductAddAttr";
import ASelectBox from "../selectbox/ASelectBox";
import { findColorByName } from "../../api/color";

const emptyInventoryRow = () => ({
  id: undefined,
  sizeId: null,
  sizeLabel: null,
  colorId: null,
  colorLabel: null,
  price: "",
  quantity: "",
});

const InsertProductForm = ({ errors, setErrors, setToastList }) => {
  const form = useRef();
  const [searchParams, setSearchParams] = useSearchParams();

  const [existingProduct, setExistingProduct] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mainImage, setMainImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [typeSelect, setTypeSelect] = useState({
    label: "بشقاب (تکی)",
    value: "plate",
  });
  const [setItems, setSetItems] = useState(null);
  const [containValue, setContainValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [manualPrice, setManualPrice] = useState("");
  const [setPricePreview, setSetPricePreview] = useState(null);

  const [moldOptions, setMoldOptions] = useState([]);
  const [patternOptions, setPatternOptions] = useState([]);
  const [selectedMold, setSelectedMold] = useState(null);
  const [newMoldName, setNewMoldName] = useState("");
  const [newSizeLabel, setNewSizeLabel] = useState("");
  const [newSizeHeight, setNewSizeHeight] = useState("");
  const [newSizeWidth, setNewSizeWidth] = useState("");
  const [newSizeWeight, setNewSizeWeight] = useState("");
  const [selectedMoldPattern, setSelectedMoldPattern] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [newPatternName, setNewPatternName] = useState("");
  const [inventoryRows, setInventoryRows] = useState([emptyInventoryRow()]);

  const refreshMolds = () => fetchMolds(setMoldOptions);
  const refreshPatterns = () => fetchPatterns(setPatternOptions);

  useEffect(() => {
    refreshMolds();
    refreshPatterns();
  }, []);

  useEffect(() => {
    if (!selectedMold) return;
    const freshMold = moldOptions.find((m) => m.id === selectedMold.id);
    if (freshMold && freshMold !== selectedMold) {
      setSelectedMold(freshMold);
    }
  }, [moldOptions, existingProduct]);

  const rowSizeOptions = (selectedMold?.sizes || []).map((size) => ({
    label: size.sizeLabel,
    value: size.id,
  }));

  const moldPatternOptions = (selectedMold?.moldPatterns || []).map((mp) => ({
    label: mp.pattern ? mp.pattern.name : "بدون طرح (فقط رنگی)",
    value: mp.id,
  }));

  useEffect(() => {
    if (searchParams.has("productId"))
      fetchSingleProduct(searchParams.get("productId"), setExistingProduct);
  }, [searchParams.get("productId")]);

  const ExistingProductFormSetter = () => {
    try {
      if (!existingProduct?.id) return;
      const currentForm = form.current;
      currentForm.code.value = existingProduct.code;
      currentForm.productName.value = existingProduct.name;
      currentForm.description.value = existingProduct.description;
      currentForm.offPercent.value = existingProduct.offPercent;
      currentForm.material.value = existingProduct.material;
      setContainValue(existingProduct.contain || "");
      setManualPrice(
        existingProduct.manualPriceOverride != null
          ? String(existingProduct.manualPriceOverride)
          : ""
      );

      const invRows = (existingProduct.inventories || []).map((inv) => ({
        id: inv.id,
        sizeId: inv.size?.id ?? null,
        sizeLabel: inv.size?.sizeLabel ?? null,
        colorId: inv.colorId ?? null,
        colorLabel: inv.color?.name ?? null,
        price: String(inv.price ?? ""),
        quantity: String(inv.quantity ?? ""),
      }));
      setInventoryRows(invRows.length > 0 ? invRows : [emptyInventoryRow()]);

      if (existingProduct.type === "plate") {
        const moldToSelect =
          moldOptions.find(
            (m) => m.id === existingProduct.moldPattern?.mold?.id
          ) ||
          existingProduct.moldPattern?.mold ||
          null;
        if (moldToSelect) {
          setSelectedMold(moldToSelect);
        }
        if (existingProduct.moldPattern) {
          setSelectedMoldPattern({
            label: existingProduct.moldPattern.pattern
              ? existingProduct.moldPattern.pattern.name
              : "بدون طرح (فقط رنگی)",
            value: existingProduct.moldPattern.id,
          });
          if (existingProduct.moldPattern.pattern) {
            setSelectedPattern({
              label: existingProduct.moldPattern.pattern.name,
              value: existingProduct.moldPattern.pattern.id,
            });
          }
        }
      }

      setTypeSelect(
        existingProduct.type === "productSet"
          ? { label: "سرویس (ست)", value: "productSet" }
          : { label: "بشقاب (تکی)", value: "plate" }
      );
      if (existingProduct.type === "productSet") {
        setSetItems(
          existingProduct?.productSetItems?.map((item) => {
            return {
              label: item.plate.name,
              value: item.plate.id,
              quantity: item.quantity,
            };
          })
        );
      }

      if (existingProduct?.mainCategory?.id) {
        setSearchParams((prev) => {
          prev.set("categoryId", existingProduct.mainCategory.id);
          return prev;
        });
      }

      setUploadedImages([
        ...(existingProduct?.images || []),
        ...(existingProduct?.mainImage ? [existingProduct?.mainImage] : []),
      ]);

      setMainImage(existingProduct?.mainImage || null);
    } catch (error) {
      console.error("Error setting existing product form:", error);
    }
  };
  useDidUpdateEffect(ExistingProductFormSetter, [existingProduct]);

  useEffect(() => {
    if (
      typeSelect.value !== "productSet" ||
      !setItems ||
      setItems.length === 0
    ) {
      setSetPricePreview(null);
      return;
    }
    calcSetPricePreview(
      setItems.map((item) => ({
        plateId: item.value,
        quantity: Number(item.quantity) || 1,
      })),
      (data) => setSetPricePreview(data)
    );
  }, [typeSelect.value, setItems]);

  const handleCreateMold = async () => {
    if (!newMoldName.trim()) return;
    const created = await new Promise((resolve) =>
      createMold({ name: newMoldName.trim() }, resolve)
    );
    if (created) {
      setNewMoldName("");
      refreshMolds();
      setSelectedMold(created);
    } else {
      setToastList((prev) => [
        ...prev,
        { type: "danger", message: "ثبت قالب ناموفق بود" }
      ]);
    }
  };

  const handleCreateSize = async () => {
    if (!selectedMold || !newSizeLabel.trim()) return;
    const created = await new Promise((resolve) =>
      createMoldSize(
        {
          moldId: selectedMold.id,
          sizeLabel: newSizeLabel.trim(),
          height: newSizeHeight,
          width: newSizeWidth,
          weight: newSizeWeight,
        },
        resolve
      )
    );
    if (created) {
      setNewSizeLabel("");
      setNewSizeHeight("");
      setNewSizeWidth("");
      setNewSizeWeight("");
      refreshMolds();
    } else {
      setToastList((prev) => [
        ...prev,
        { type: "danger", message: "ثبت سایز ناموفق بود" }
      ]);
    }
  };

  const handleCreatePattern = async () => {
    if (!newPatternName.trim()) return;
    const created = await new Promise((resolve) =>
      createPattern(newPatternName.trim(), undefined, resolve)
    );
    if (created) {
      setNewPatternName("");
      refreshPatterns();
      setSelectedPattern({ label: created.name, value: created.id });
    } else {
      setToastList((prev) => [
        ...prev,
        { type: "danger", message: "ثبت طرح ناموفق بود" }
      ]);
    }
  };

  const handleLinkPattern = async () => {
    if (!selectedMold) return null;
    const patternId = selectedPattern ? selectedPattern.value : null;
    const existingLink = (selectedMold?.moldPatterns || []).find(
      (mp) => (mp.pattern?.id ?? null) === (patternId ?? null)
    );
    if (existingLink) {
      return existingLink;
    }
    const created = await new Promise((resolve) =>
      createMoldPatternLink(
        { moldId: selectedMold.id, patternId: patternId },
        resolve
      )
    );
    if (created) {
      refreshMolds();
      return created;
    }
    return null;
  };

  const getFormValues = () => {
    const priceValues = inventoryRows
      .filter((row) => Number(row.price) > 0 && Number(row.quantity) > 0)
      .map((row) => ({
        id: row.id ?? undefined,
        colorId: row.colorId ? Number(row.colorId) : undefined,
        sizeId: row.sizeId ? Number(row.sizeId) : undefined,
        price: Number(row.price),
        quantity: Number(row.quantity),
      }));
    let values = {
      code: form.current.code.value,
      productName: form.current.productName.value,
      description: form.current.description.value,
      offPercent: Number(form.current.offPercent.value),
      material: form.current.material.value,
      inventories: priceValues,
    };
    if (typeSelect.value === "productSet") {
      values.contain = containValue;
      values.items = (setItems || []).map((item) => ({
        plateId: item.value,
        quantity: Number(item.quantity) || 1,
      }));
      const manualPriceValue = Number(manualPrice);
      if (manualPrice !== "" && !isNaN(manualPriceValue)) {
        values.manualPriceOverride = manualPriceValue;
      } else if (searchParams.get("productId")) {
        values.manualPriceOverride = null;
      }
    }
    return values;
  };

  const preparePayload = (values, moldPatternId) => {
    const mainImageIdValue = mainImage ? Number(mainImage.id) : undefined;
    const imageIds = uploadedImages
      .filter((img) => !mainImageIdValue || img.id !== mainImageIdValue)
      .map((img) => Number(img.id));
    const categoryId = Number(searchParams.get("categoryId"));

    const payload = {
      ...values,
      type: typeSelect.value,
      imageIds,
    };

    if (!isNaN(categoryId) && categoryId > 0) {
      payload.categoryId = categoryId;
    }
    if (mainImageIdValue) {
      payload.mainImageId = mainImageIdValue;
    }
    if (typeSelect.value === "plate") {
      payload.moldPatternId = moldPatternId;
      delete payload.pattern;
    }
    return payload;
  };

  const submitFormHandler = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);

    // inventory rows are only required for plates; a product set gets its
    // price/stock from its member plates
    const validInventoryRows = inventoryRows.filter(
      (row) => Number(row.price) > 0 && Number(row.quantity) > 0
    );
    if (typeSelect.value === "plate" && validInventoryRows.length === 0) {
      setToastList((prev) => [
        ...prev,
        {
          type: "danger",
          message: "حداقل یک ردیف موجودی با قیمت و تعداد معتبر لازم است"
        }
      ]);
      setLoading(false);
      return;
    }
    if (uploadedImages.length === 0) {
      setToastList((prev) => [
        ...prev,
        { type: "danger", message: "لطفا حداقل یک تصویر آپلود کنید" }
      ]);
      setLoading(false);
      return;
    }
    if (!mainImage) {
      setToastList((prev) => [
        ...prev,
        {
          type: "danger",
          message: "لطفا با آیکون پرچم تصویر اصلی را مشخص کنید"
        }
      ]);
      setLoading(false);
      return;
    }
    const selectedCategoryId = Number(searchParams.get("categoryId"));
    if (isNaN(selectedCategoryId) || selectedCategoryId <= 0) {
      setToastList((prev) => [
        ...prev,
        { type: "danger", message: "لطفا دسته بندی کالا را انتخاب کنید" }
      ]);
      setLoading(false);
      return;
    }

    try {
      let moldPatternId = undefined;
      if (typeSelect.value === "plate") {
        if (!selectedMold) {
          setToastList((prev) => [
            ...prev,
            { type: "danger", message: "لطفا قالب را انتخاب کنید" }
          ]);
          setLoading(false);
          return;
        }
        if (validInventoryRows.some((row) => !row.sizeId)) {
          setToastList((prev) => [
            ...prev,
            {
              type: "danger",
              message: "لطفا سایز همه ردیف‌های موجودی را انتخاب کنید"
            }
          ]);
          setLoading(false);
          return;
        }
        const linked = await handleLinkPattern();
        if (!linked) {
          setToastList((prev) => [
            ...prev,
            { type: "danger", message: "ثبت ترکیب قالب و طرح ناموفق بود" }
          ]);
          setLoading(false);
          return;
        }
        moldPatternId = linked.id;
      }

      const formValues = getFormValues();
      const payload = preparePayload(formValues, moldPatternId);

      const productId = searchParams.get("productId");
      const endpoint = productId
        ? `product/admin/update/${productId}`
        : `product/admin/save`;

      const ok = await formApiHandler(
        endpoint,
        payload,
        setToastList,
        setErrors,
        setLoading
      );
      if (ok && !productId) {
        form.current.reset();
        setInventoryRows([emptyInventoryRow()]);
        setUploadedImages([]);
        setMainImage(null);
        setSelectedMold(null);
        setSelectedMoldPattern(null);
        setSelectedPattern(null);
        setSetItems(null);
        setContainValue("");
        setManualPrice("");
        setTypeSelect({ label: "بشقاب (تکی)", value: "plate" });
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const loadcolorOptions = useCallback(findColorByName);

  const handleInventoryRowChange = (index, field, value, label) => {
    const labelField = field === "sizeId" ? "sizeLabel" : "colorLabel";
    setInventoryRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: value,
              ...(label !== undefined ? { [labelField]: label } : {}),
            }
          : row
      )
    );
  };

  return (
    <form
      onSubmit={submitFormHandler}
      ref={form}
      className="flex flex-col gap-y-6"
    >
      <div className="glass rounded-2xl p-5 flex gap-x-4">
        <div className="self-start mt-1">
          <i className="fa-solid fa-2x fa-square-plus text-sky-400"></i>
        </div>
        <div className="grow flex flex-col gap-y-3">
          <div className="text-lg font-bold text-[var(--color-white)]">
            گام اول: انتخاب گروه کالا
          </div>
          <div className="mx-1">
            <SelectCategories allwaysActive={true} />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 flex gap-x-4">
        <div className="self-start mt-1">
          <i className="fa-solid fa-2x fa-square-plus text-emerald-400"></i>
        </div>
        <div className="grow flex flex-col gap-y-6">
          <div className="text-lg font-bold text-[var(--color-white)]">گام دوم: درج اطلاعات کالا</div>
          <div className="grid grid-cols-12 gap-x-3 gap-y-4 items-center">
            <div className="flex flex-col lg:col-span-6 col-span-12">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                نام فارسی کالا
              </div>
              <Input iMessage={errors?.productName} name="productName" />
            </div>
            <div className="flex flex-col lg:col-span-3 col-span-12">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                جنس
              </div>
              <Input iMessage={errors?.material} name="material" />
            </div>
            <div className="flex flex-col lg:col-span-3 col-span-12">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                درصد تخفیف
              </div>
              <Input iMessage={errors?.offPercent} name="offPercent" type="number" />
            </div>
            <div className="flex flex-col lg:col-span-3 col-span-12">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                کد
              </div>
              <Input iMessage={errors?.code} name="code" />
            </div>
            <div className="flex flex-col lg:col-span-4 col-span-12">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                نوع محصول
              </div>
              <SelectBox
                options={[
                  { label: "بشقاب (تکی)", value: "plate" },
                  { label: "سرویس (ست)", value: "productSet" }
                ]}
                value={typeSelect}
                onChange={(val) => {
                  setTypeSelect(val);
                  setSetItems(null);
                  setSetPricePreview(null);
                  setManualPrice("");
                }}
                name="type"
              />
            </div>
            <div className="flex flex-col col-span-12">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                توضیحات
              </div>
              <Input
                iMessage={errors?.description}
                name="description"
                type="textarea"
              />
            </div>
          </div>
        </div>
      </div>

      {typeSelect.value === "plate" ? (
        <div className="glass rounded-2xl p-5 flex gap-x-4">
          <div className="self-start mt-1">
            <i className="fa-solid fa-2x fa-cubes-stacked text-amber-400"></i>
          </div>
          <div className="grow flex flex-col gap-y-6">
            <div className="text-lg font-bold text-[var(--color-white)]">
              گام سوم: انتخاب قالب و طرح
            </div>
            <div className="grid grid-cols-12 gap-x-3 gap-y-4 items-center">
              <div className="flex flex-col lg:col-span-6 col-span-12">
                <div className="mb-2 font-medium text-sm">
                  <span className="text-red-500 text-lg">*</span>
                  قالب
                </div>
                <ASelectBox
                  loadOptions={(input, callback) =>
                    callback(
                      moldOptions
                        .filter((m) => m.name.includes(input || ""))
                        .map((m) => ({ label: m.name, value: m.id }))
                    )
                  }
                  isSearchable={true}
                  value={
                    selectedMold
                      ? { label: selectedMold.name, value: selectedMold.id }
                      : null
                  }
                  onChange={(val) => {
                    setSelectedMold(
                      moldOptions.find((m) => m.id === val?.value) || null
                    );
                    setSelectedMoldPattern(null);
                    setSelectedPattern(null);
                    setInventoryRows((prev) =>
                      prev.map((row) => ({
                        ...row,
                        sizeId: null,
                        sizeLabel: null,
                      }))
                    );
                  }}
                />
              </div>
              <div className="flex flex-col lg:col-span-6 col-span-12">
                <div className="mb-2 font-medium text-sm">قالب جدید</div>
                <div className="flex gap-x-2">
                  <Input
                    name="newMoldName"
                    value={newMoldName}
                    onChange={(e) => setNewMoldName(e.target.value)}
                  />
                  <Button
                    type="button"
                    size="sm"
                    bgColor="bg-[var(--bf-sky)]"
                    txtColor="text-white"
                    shape="rounded-lg"
                    moreCss="cursor-pointer shrink-0"
                    onClick={handleCreateMold}
                  >
                    ثبت قالب
                  </Button>
                </div>
              </div>

              {selectedMold ? (
                <>
                  <div className="flex flex-col lg:col-span-6 col-span-12">
                    <div className="mb-2 font-medium text-sm">سایز جدید</div>
                    <p className="mb-2 text-xs text-[var(--sub-text-color)]">
                      سایزها در گام چهارم برای هر ردیف موجودی انتخاب می‌شوند
                    </p>
                    <div className="grid grid-cols-4 gap-x-2">
                      <Input
                        placeholder="نام سایز"
                        value={newSizeLabel}
                        onChange={(e) => setNewSizeLabel(e.target.value)}
                      />
                      <Input
                        placeholder="ارتفاع"
                        value={newSizeHeight}
                        onChange={(e) => setNewSizeHeight(e.target.value)}
                      />
                      <Input
                        placeholder="عرض"
                        value={newSizeWidth}
                        onChange={(e) => setNewSizeWidth(e.target.value)}
                      />
                      <Input
                        placeholder="وزن"
                        value={newSizeWeight}
                        onChange={(e) => setNewSizeWeight(e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      bgColor="bg-[var(--bf-sky)]"
                      txtColor="text-white"
                      shape="rounded-lg"
                      moreCss="cursor-pointer mt-2"
                      onClick={handleCreateSize}
                    >
                      ثبت سایز
                    </Button>
                  </div>

                  <div className="flex flex-col lg:col-span-6 col-span-12">
                    <div className="mb-2 font-medium text-sm">
                      <span className="text-red-500 text-lg">*</span>
                      ترکیب قالب + طرح
                    </div>
                    <ASelectBox
                      loadOptions={(input, callback) =>
                        callback(
                          moldPatternOptions.filter((p) =>
                            p.label.includes(input || "")
                          )
                        )
                      }
                      isSearchable={true}
                      value={selectedMoldPattern}
                      onChange={(val) => {
                        setSelectedMoldPattern(val);
                        const mp = (selectedMold?.moldPatterns || []).find(
                          (item) => item.id === val?.value
                        );
                        setSelectedPattern(
                          mp?.pattern
                            ? { label: mp.pattern.name, value: mp.pattern.id }
                            : null
                        );
                      }}
                    />
                  </div>
                  <div className="flex flex-col lg:col-span-6 col-span-12">
                    <div className="mb-2 font-medium text-sm">طرح (برای ساخت ترکیب جدید)</div>
                    <ASelectBox
                      loadOptions={(input, callback) =>
                        callback([
                          { label: "بدون طرح (فقط رنگی)", value: null },
                          ...patternOptions
                            .filter((p) => p.name.includes(input || ""))
                            .map((p) => ({ label: p.name, value: p.id })),
                        ])
                      }
                      isSearchable={true}
                      value={selectedPattern}
                      onChange={(val) => setSelectedPattern(val)}
                    />
                    <div className="flex gap-x-2 mt-2">
                      <Input
                        placeholder="نام طرح جدید"
                        value={newPatternName}
                        onChange={(e) => setNewPatternName(e.target.value)}
                      />
                      <Button
                        type="button"
                        size="sm"
                        bgColor="bg-[var(--bf-sky)]"
                        txtColor="text-white"
                        shape="rounded-lg"
                        moreCss="cursor-pointer shrink-0"
                        onClick={handleCreatePattern}
                      >
                        ثبت طرح
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="glass rounded-2xl p-5 flex gap-x-4">
        <div className="self-start mt-1">
          <i className="fa-solid fa-2x fa-square-plus text-red-400"></i>
        </div>
        <div className="grow flex flex-col gap-y-6">
          <div className="text-lg font-bold text-[var(--color-white)]">
            {typeSelect.value === "plate"
              ? "گام چهارم: موجودی رنگی"
              : "گام سوم: ویژگی های کالا"}
          </div>
          {typeSelect.value === "plate" ? (
            <div className="flex flex-col gap-y-3">
              <div className="grid grid-cols-12 gap-x-2 text-sm font-medium text-[var(--sub-text-color)]">
                <div className="col-span-3">سایز</div>
                <div className="col-span-3">رنگ</div>
                <div className="col-span-2">قیمت</div>
                <div className="col-span-2">تعداد</div>
                <div className="col-span-2"></div>
              </div>
              {inventoryRows.map((row, index) => (
                <div key={index} className="grid grid-cols-12 gap-x-2 items-center">
                  <div className="col-span-3">
                    <ASelectBox
                      loadOptions={(input, callback) =>
                        callback(
                          rowSizeOptions.filter((s) =>
                            s.label.includes(input || "")
                          )
                        )
                      }
                      isSearchable={true}
                      value={
                        row.sizeId
                          ? { label: row.sizeLabel || String(row.sizeId), value: row.sizeId }
                          : null
                      }
                      onChange={(val) =>
                        handleInventoryRowChange(
                          index,
                          "sizeId",
                          val?.value ?? null,
                          val?.label ?? null
                        )
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <ASelectBox
                      loadOptions={loadcolorOptions}
                      isSearchable={true}
                      value={
                        row.colorId
                          ? { label: row.colorLabel || String(row.colorId), value: row.colorId }
                          : null
                      }
                      onChange={(val) =>
                        handleInventoryRowChange(
                          index,
                          "colorId",
                          val?.value ?? null,
                          val?.label ?? null
                        )
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      value={row.price}
                      onChange={(e) =>
                        handleInventoryRowChange(index, "price", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        handleInventoryRowChange(index, "quantity", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    {inventoryRows.length > 1 ? (
                      <i
                        onClick={() =>
                          setInventoryRows(inventoryRows.filter((_, i) => i !== index))
                        }
                        className="fa-solid fa-trash text-bf-red cursor-pointer"
                      ></i>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setInventoryRows([...inventoryRows, emptyInventoryRow()])
                }
                className="self-start text-sm font-semibold text-[var(--color-gold)] cursor-pointer"
              >
                + افزودن ردیف سایز × رنگ
              </button>
            </div>
          ) : typeSelect.value === "productSet" ? (
            <div className="grid grid-cols-12 gap-x-3 gap-y-4 items-center">
              <InsertProductAddAttr
                errors={errors}
                type={typeSelect.value}
                setItems={setItems}
                setSetItems={setSetItems}
                containValue={containValue}
                onContainChange={(e) => setContainValue(e.target.value)}
              />
              {(setItems || []).length > 0 ? (
                <div className="col-span-12 flex flex-col gap-y-3 glass rounded-2xl p-4">
                  {setPricePreview?.hasNoCommonColor ? (
                    <div className="text-sm font-semibold text-[var(--bf-red)]">
                      هشدار: این سرویس هیچ رنگ مشترکی بین قطعاتش نداره، مشتری نمی‌تونه سفارشش بده
                    </div>
                  ) : setPricePreview?.colors?.[0] ? (
                    <div className="text-sm text-[var(--color-white)]">
                      قیمت پیشنهادی سرویس:{" "}
                      <span className="font-bold text-[var(--color-gold)]">
                        {formatNumber(setPricePreview.colors[0].calculatedPrice)}
                      </span>{" "}
                      تومان
                    </div>
                  ) : null}
                  <div className="flex flex-col">
                    <div className="mb-2 font-medium text-sm">
                      قیمت دستی (اختیاری)
                    </div>
                    <Input
                      name="manualPriceOverride"
                      type="number"
                      iMessage={errors?.manualPriceOverride}
                      value={manualPrice}
                      onChange={(e) => {
                        // negative prices are meaningless for a set; keep the
                        // field clean instead of relying on the backend error
                        const value = e.target.value;
                        if (value !== "" && Number(value) < 0) return;
                        setManualPrice(value);
                      }}
                    />
                    <p className="mt-2 text-xs text-[var(--sub-text-color)]">
                      اگه خالی بمونه، قیمت خودکار از جمع قطعات محاسبه میشه
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 flex gap-x-4">
        <div className="self-start mt-1">
          <i className="fa-solid fa-2x fa-square-plus text-purple-400"></i>
        </div>
        <div className="grow flex flex-col gap-y-6">
          <div className="text-lg font-bold text-[var(--color-white)]">آپلود عکس</div>
          <div className="flex border justify-center items-center border-[var(--glass-border)] border-dashed rounded-xl p-10 relative cursor-pointer hover:border-[var(--color-gold)] transition-colors">
            {isUploading ? (
              <>
                <input
                  onChange={(e) =>
                    uploadImage(
                      e,
                      setUploadProgress,
                      setUploadedImages,
                      setIsUploading,
                      setErrors,
                      setToastList
                    )
                  }
                  type="file"
                  name="productImage"
                  className="absolute top-0 w-full h-full z-30 opacity-0 hidden"
                />
                <ProgressBar
                  className="h-[20px]"
                  persentage={uploadProgress}
                />
              </>
            ) : (
              <>
                <input
                  onChange={(e) =>
                    uploadImage(
                      e,
                      setUploadProgress,
                      setUploadedImages,
                      setIsUploading,
                      setErrors,
                      setToastList
                    )
                  }
                  type="file"
                  name="productImage"
                  className="absolute top-0 w-full h-full z-30 opacity-0"
                />
                <i className="fa-solid fa-circle-plus fa-3x text-sky-400"></i>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 flex flex-col gap-y-4">
        <div className="text-lg font-bold text-[var(--color-white)]">تصاویر بارگذاری شده</div>
        <div className="flex flex-col">
          {uploadedImages.map((image) => {
            return (
              <div
                key={image?.id}
                className={`glass glass-hover rounded-xl p-4 flex justify-between items-center mb-3 ${mainImage?.id === image?.id ? "border-r-2 border-[var(--color-gold)]" : ""}`}
              >
                <div className="flex items-center gap-x-3">
                  <SmartImage
                    className="w-[60px] rounded-lg"
                    src={imageServerAddress + image?.filePath}
                    alt=""
                    ratio="1/1"
                  />
                  <span className="text-sm text-[var(--sub-text-color)]">
                    {image?.filePath}
                  </span>
                </div>
                <div className="flex gap-x-3">
                  <div
                    onClick={() => setMainImage(image)}
                    className="cursor-pointer w-9 h-9 rounded-lg bg-[var(--color-gold-light)] flex items-center justify-center transition-colors hover:bg-[var(--color-gold)] hover:text-white"
                  >
                    <i className={`fa-solid fa-flag ${mainImage?.id === image?.id ? "gold-text" : "text-[var(--sub-text-color)]"}`}></i>
                  </div>
                  <div
                    onClick={() => setUploadedImages(uploadedImages.filter((img) => img.id !== image.id))}
                    className="cursor-pointer w-9 h-9 rounded-lg bg-bf-lighter-red flex items-center justify-center transition-colors hover:bg-bf-red hover:text-white"
                  >
                    <i className="fa-solid fa-trash text-bf-red"></i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Button
        bgColor="bg-[var(--color-gold)]"
        txtColor="text-white"
        shape="rounded-lg"
        disabled={loading}
        moreCss="cursor-pointer"
      >
        {loading ? <Loading className="w-6 h-6" /> : "ثبت کالا"}
      </Button>
    </form>
  );
};
export default InsertProductForm;
