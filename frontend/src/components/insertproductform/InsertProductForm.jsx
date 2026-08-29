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
} from "../../api/productApi";
import useDidUpdateEffect from "../../hooks/useDidUpdateEffect";
import Loading from "../icons/Loading";
import SelectCategories from "../selectcategories/SelectCategories";
import { imageServerAddress } from "../../App";
import SmartImage from "../smartimage/SmartImage";
import schema from "../../schema/schema";
import InsertProductAddAttr from "../insertproductadattr/InsertProductAddAttr";
import ASelectBox from "../selectbox/ASelectBox";
import { findColorByName, findColorById } from "../../api/color";
// const ValidationSchema = Yup.object().shape({
//   email: Yup.string()
//     .email("Invalid email address")
//     .required("Email is required"),
//   password: Yup.string()
//     .required("Password is required")
//     .min(6, "Password must be at least 6 characters"),
// });
const InsertProductForm = ({ errors, setErrors, setToastList }) => {
  const form = useRef();
  const [searchParams, setSearchParams] = useSearchParams();

  const [existingProduct, setExistingProduct] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mainImage, setMainImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [typeSelect, setTypeSelect] = useState({
    label: "plate",
    value: "plate",
  });
  const [serviceProducts, setServiceProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    if (searchParams.has("productId"))
      fetchSingleProduct(searchParams.get("productId"), setExistingProduct);
    // todo declear product state and use useeffect([product])
  }, [searchParams.get("productId")]);
  const ExistingProductFormSetter = () => {
    try {
      const currentForm = form.current;
      currentForm.code.value = existingProduct.code;
      currentForm.productName.value = existingProduct.name;
      currentForm.description.value = existingProduct.description;
      currentForm.price.value = existingProduct.inventories[0].price;
      currentForm.offPercent.value = existingProduct.offPercent;
      currentForm.material.value = existingProduct.material;
      currentForm.pattern.value = existingProduct.pattern;
      currentForm.quantity.value = existingProduct.inventories[0].quantity;
      currentForm.colorId.value = existingProduct.color?.id || "";
      if (existingProduct.color) {
        setSelectedColor({ value: existingProduct.color.id, label: existingProduct.color.name });
      }
      
      if (existingProduct.type === "plate") {
        currentForm.weight.value = existingProduct.weight;
        currentForm.height.value = existingProduct.height;
        currentForm.width.value = existingProduct.width;
      }
      
      setTypeSelect({
        label: existingProduct.type,
        value: existingProduct.type,
      });
      // set service plates if existing product is service
      if (existingProduct.type === "service") {
        setServiceProducts(
          existingProduct?.plates?.map((plate) => {
            return { label: plate.name, value: plate.id };
          })
        );
      }

      setSearchParams((prev) => {
        prev.set("categoryId", existingProduct?.mainCategory?.id);
        return prev;
      });

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

  // const formik = useFormik({
  //   initialValues: {
  //     email: "",
  //     password: "",
  //   },
  //   validationSchema: ValidationSchema,
  //   onSubmit: (values) => {

  //   },
  // });

  const getFormValues = (e) => {
    let values = {
      code: e.target.code.value,
      productName: e.target.productName.value,
      description: e.target.description.value,
      price: Number(e.target.price.value),
      offPercent: Number(e.target.offPercent.value),
      quantity: Number(e.target.quantity.value),
      material: e.target.material.value,
      pattern: e.target.pattern.value,
      colorId: selectedColor ? selectedColor.value : undefined,
    };
    if (typeSelect.value === "service") {
      values.contain = e.target.contain.value;
      const plateIds = serviceProducts?.map((p) => p.value);
      values.plateIds = plateIds || [];
    } else {
      values.weight = Number(e.target.weight.value);
      values.height = Number(e.target.height.value);
      values.width = Number(e.target.width.value);
    }
    return values;
  };
  const preparePayload = (values) => {
    const mainImageIdValue = mainImage ? Number(mainImage.id) : undefined;
    const imageIds = uploadedImages
      .filter((img) => !mainImageIdValue || img.id !== mainImageIdValue)
      .map((img) => Number(img.id));
    const categoryId = Number(searchParams.get("categoryId"));

    const payload = {
      ...values,
      type: typeSelect.value,
      imageIds,
      inventories: [{ quantity: values.quantity, price: values.price }],
    };

    // Only add categoryId if it's valid
    if (!isNaN(categoryId) && categoryId > 0) {
      payload.categoryId = categoryId;
    }

    // Only add mainImageId if it's valid
    if (mainImageIdValue) {
      payload.mainImageId = mainImageIdValue;
    }

    // Remove colorId if it's 0 or undefined
    if (!payload.colorId || payload.colorId === 0) {
      delete payload.colorId;
    }
    // Remove price and quantity from root (they're in inventories)
    delete payload.price;
    delete payload.quantity;

    return payload;
  };
  const submitFormHandler = (e) => {
    e.preventDefault();

    setErrors([]);
    setLoading(true);

    // 1. جمع‌آوری داده‌ها از فرم
    const formValues = getFormValues(e);

    // // 2. اعتبارسنجی ساده (در صورت نیاز می‌تونه عمیق‌تر باشه)
    // const validationErrors = validateForm(formValues);
    // if (validationErrors.length > 0) {
    //   setErrors(validationErrors);
    //   setLoading(false);
    //   return;
    // }

    // 3. آماده‌سازی payload نهایی
    const payload = preparePayload(formValues);

    // 4. ارسال به API
    const productId = searchParams.get("productId");
    const endpoint = productId
      ? `product/admin/update/${productId}`
      : `product/admin/save`;

    formApiHandler(endpoint, payload, setToastList, setErrors, setLoading);
  };
  const loadcolorOptions = useCallback(findColorByName);

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
            <div className="flex flex-col col-span-2">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                تعداد
              </div>
              <Input iMessage={errors?.quantity} name="quantity" />
            </div>
            <div className="flex flex-col lg:col-span-3 col-span-12">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                قیمت
              </div>
              <Input iMessage={errors?.price} name="price" />
            </div>
            <div className="flex flex-col col-span-3">
              <div className="mb-2 font-medium text-sm">
                درصد تخفیف
              </div>
              <Input iMessage={errors?.offPercent} name="offPercent" />
            </div>
            <div className="flex flex-col col-span-4">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                کد
              </div>
              <Input iMessage={errors?.code} name="code" />
            </div>
            <div className="flex flex-col col-span-4">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                رنگ
              </div>
              <ASelectBox
                loadOptions={loadcolorOptions}
                isSearchable={true}
                name="colorId"
                value={selectedColor}
                onChange={(val) => setSelectedColor(val)}
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

      <div className="glass rounded-2xl p-5 flex gap-x-4">
        <div className="self-start mt-1">
          <i className="fa-solid fa-2x fa-square-plus text-red-400"></i>
        </div>
        <div className="grow flex flex-col gap-y-6">
          <div className="text-lg font-bold text-[var(--color-white)]">
            گام سوم: درج ویژگی های کالا
          </div>
          <div className="grid grid-cols-12 gap-x-3 gap-y-4 items-center">
            <div className="flex flex-col col-span-12">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                نوع محصول
              </div>
              <SelectBox
                options={Object.keys(schema)
                  .filter((key) => key !== "product")
                  .map((key) => ({ label: key, value: key }))}
                value={typeSelect}
                onChange={(val) => {
                  setTypeSelect(val);
                }}
                iMessage={errors?.material}
                name="type"
              />
            </div>
            <div className="flex flex-col col-span-4">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                جنس
              </div>
              <Input iMessage={errors?.material} name="material" />
            </div>
            <div className="flex flex-col col-span-4">
              <div className="mb-2 font-medium text-sm">
                <span className="text-red-500 text-lg">*</span>
                طرح
              </div>
              <Input iMessage={errors?.pattern} name="pattern" />
            </div>
            <InsertProductAddAttr
              errors={errors}
              type={typeSelect.value}
              serviceProducts={serviceProducts}
              setServiceProducts={setServiceProducts}
            />
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 flex gap-x-4">
        <div className="self-start mt-1">
          <i className="fa-solid fa-2x fa-square-plus text-purple-400"></i>
        </div>
        <div className="grow flex flex-col gap-y-6">
          <div className="text-lg font-bold text-[var(--color-white)]">گام چهارم: آپلود عکس</div>
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
