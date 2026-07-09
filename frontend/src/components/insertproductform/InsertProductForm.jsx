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
import schema from "../../schema/schema";
import InsertProductAddAttr from "../insertproductadattr/InsertProductAddAttr";
import ASelectBox from "../selectbox/ASelectBox";
import { findColorByName } from "../../api/color";
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
      currentForm.quantity.value = existingProduct.inventories[0].quantity;
      currentForm.colorId.value = existingProduct.color.id;
      setTypeSelect({
        label: existingProduct.type,
        value: existingProduct.type,
      });
      // set service paltes if existing product is service
      if (existingProduct.type === "service") {
        setServiceProducts(
          existingProduct?.plates?.map((plate) => {
            return { label: plate.name, value: plate.id };
          })
        );
      }

      // todo categoy lis is comming we fucked
      // e.target.categoryId.value = product.category;
      setSearchParams((prev) => {
        prev.set("categoryId", existingProduct?.mainCategory?.id);
        return prev;
      });

      setUploadedImages([
        ...(existingProduct?.images || []),
        ...(existingProduct?.mainImage ? [existingProduct?.mainImage] : []),
      ]);

      setMainImage(existingProduct?.mainImage || null);
    } catch (error) {}
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
      colorId: Number(e.target.colorId.value),
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
    const imageIds = uploadedImages
      .filter((img) => img.id !== mainImage.id)
      .map((img) => Number(img.id));
    const categoryId = Number(searchParams.get("categoryId"));
    const mainImageId = Number(mainImage.id);

    return {
      ...values,
      categoryId,
      type: typeSelect.value,
      imageIds,
      mainImageId,

      inventories: [{ quantity: values.quantity, price: values.price }],
    };
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

  // const loadBrandOptions = useCallback(findBrandByName);

  return (
    <form
      onSubmit={submitFormHandler}
      ref={form}
      className="insert-product-form flex flex-col gap-y-10"
    >
      <div className="flex ">
        <div className="mx-2 self-start">
          <i class="fa-solid fa-2x fa-square-plus text-sky-400"></i>
        </div>

        <div className="grow flex flex-col gap-y-3">
          <div className=" text-lg font-semibold">
            گام اول: انتخاب گروه کالا
          </div>
          <div className="mx-3">
            <SelectCategories allwaysActive={true} />
          </div>
        </div>
      </div>
      <div className="flex ">
        <div className="mx-2 self-start">
          <i class="fa-solid fa-2x fa-square-plus text-emerald-400"></i>
        </div>

        <div className="grow flex flex-col gap-y-10">
          <div className=" text-lg font-semibold">گام دوم:درج اطلاعات کالا</div>
          <div className="mx-3 grid grid-cols-12 gap-x-3 gap-y-4 items-center">
            <div className="flex flex-col lg:col-span-6 col-span-12  ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">نام فارسی کالا</span>
              </div>
              <Input iMessage={errors?.productName} name="productName" />
            </div>
            <div className="flex flex-col col-span-2 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">تعداد</span>
              </div>
              <Input iMessage={errors?.quantity} name={"quantity"} />
            </div>
            <div className="flex flex-col lg:col-span-3 col-span-12 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">قیمت</span>
              </div>
              <Input iMessage={errors?.price} name="price" />
            </div>
            <div className="flex flex-col col-span-3 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className="!leading-3">درصد تخفیف</span>
              </div>
              <Input iMessage={errors?.offPercent} name="offPercent" />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">کد</span>
              </div>
              <Input iMessage={errors?.code} name="code" />
            </div>
            {/* <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">برند</span>
              </div>
              <ASelectBox
                loadOptions={loadBrandOptions}
                isSearchable={true}
                name="brandId"
              />
            </div> */}
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">رنگ</span>
              </div>
              <ASelectBox
                loadOptions={loadcolorOptions}
                isSearchable={true}
                name="colorId"
              />
            </div>

            <div className="flex flex-col col-span-12 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">توضیحات</span>
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

      <div className="flex ">
        <div className="mx-2 self-start">
          <i class="fa-solid fa-2x fa-square-plus text-red-400"></i>
        </div>
        <div className="grow flex flex-col gap-y-10">
          <div className=" text-lg font-semibold">
            گام سوم:درج ویژگی های کالا
          </div>

          <div className="mx-3 grid grid-cols-12 gap-x-3 gap-y-4 items-center">
            <div className="flex flex-col col-span-12 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">نوع محصول</span>
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
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">جنس</span>
              </div>
              <Input iMessage={errors?.material} name={"material"} />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">طرح</span>
              </div>
              <Input iMessage={errors?.pattern} name={"pattern"} />
            </div>
            <InsertProductAddAttr
              errors={errors}
              type={typeSelect.value}
              serviceProducts={serviceProducts}
              setServiceProducts={setServiceProducts}
            ></InsertProductAddAttr>
          </div>
        </div>
      </div>

      <div className="flex ">
        <div className="mx-2 self-start">
          <i class="fa-solid fa-2x fa-square-plus text-purple-400"></i>
        </div>
        <div className="grow flex flex-col gap-y-10">
          <div className=" text-lg font-semibold">گام چهارم: اپلود عکس</div>
          <div className=" flex border justify-center items-center border-[var(--glass-border)] border-dotted rounded-lg p-10 relative">
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
                  className=" absolute top-0 w-full h-full z-30 opacity-0 hidden"
                ></input>
                <ProgressBar
                  className="h-[20px]"
                  persentage={uploadProgress}
                ></ProgressBar>
              </>
            ) : (
              <>
                {" "}
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
                  className=" absolute top-0 w-full h-full z-30 opacity-0"
                ></input>
                <i class="fa-thin fa-circle-plus fa-3x text-sky-400"></i>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grow flex flex-col gap-y-10">
        <div className=" text-lg font-semibold">تصاویر بارگذاری شده</div>
        <div className=" flex flex-col ">
          {uploadedImages.map((image) => {
            return (
              <div className="border flex justify-between  items-center  rounded-lg p-10">
                <div className="flex items-center">
                  <img
                    className="w-[80px]"
                    src={imageServerAddress + image?.filePath}
                  ></img>
                  <span className=" text-sm text-[var(--sub-text-color)]">
                    {image?.filePath}
                  </span>
                </div>
                <div className="flex justify-around gap-x-4">
                  <div>
                    <i
                      onClick={() => setMainImage(image)}
                      data-mainImage={mainImage?.id === image?.id}
                      class="fa-solid fa-flag data-[mainImage=true]:gold-text text-[var(--sub-text-color)] "
                    ></i>
                  </div>
                  <div>
                    <i class="fa-solid fa-trash text-red-400"></i>
                  </div>
                </div>
              </div>
            );
          })}

          {/* <div className="border flex justify-between  items-center  rounded-lg p-10">
            <div className="flex items-center">
              <img className="w-[80px]" src={productImageTest}></img>
              <span className=" text-sm text-[var(--sub-text-color)]">product93141.jpg</span>
            </div>
            <div className="flex justify-around gap-x-4">
              <div>
                <i class="fa-solid fa-flag text-sky-400"></i>
              </div>
              <div>
                <i class="fa-solid fa-trash text-red-400"></i>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <Button
        bgColor="bg-[var(--color-gold)]"
        txtColor="text-white"
        shape="rounded-lg"
        disabled={loading}
      >
        {loading ? <Loading className="w-6 h-6"></Loading> : "ثبت کالا"}
      </Button>
    </form>
  );
};
export default InsertProductForm;
