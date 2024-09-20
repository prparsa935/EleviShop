import SelectCategoryList from "../selectcategorylist/SelectCategoryList";

import Input from "../input/Input";
import ASelectBox from "../selectbox/ASelectBox";
import SelectBox from "../selectbox/SelectBox";
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteInvetory, insertInventory } from "../../utils/helperMehods";
import { uploadImage } from "../../api/uploadImage";
import ProgressBar from "../progressbar/ProgressBar";
import { useSearchParams } from "react-router-dom";
import Button from "../Button/Button";
import formApiHandler from "../../api/form";
import { fetchSingleProduct } from "../../api/productApi";
import useDidUpdateEffect from "../../hooks/useDidUpdateEffect";
import { findColorByName } from "../../api/color";
import { findBrandByName } from "../../api/brand";
import { getAllCategories } from "../../api/category";
import Loading from "../icons/Loading";
import SelectCategories from "../selectcategories/SelectCategories";
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
  const [inventories, setInventories] = useState([]);
  const [existingProduct, setExistingProduct] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [mainImage, setMainImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSingleProduct(searchParams.get("productId"), setExistingProduct);
    // todo declear product state and use useeffect([product])
  }, [searchParams.get("productId")]);
  const ExistingProductFormSetter = () => {
    try {
      const currentForm = form.current;
      currentForm.code.value = existingProduct.code;
      currentForm.productName.value = existingProduct.name;
      currentForm.description.value = existingProduct.description;
      currentForm.price.value = existingProduct.price;
      currentForm.offPercent.value = existingProduct.offPercent;
      currentForm.material.value = existingProduct.material;
      currentForm.height.value = existingProduct.height;
      // todo categoy lis is comming we fucked
      // e.target.categoryId.value = product.category;
      setSearchParams((prev) => {
        prev.set("categoryId", existingProduct?.mainCategory?.id);
        return prev;
      });
      currentForm.brandId.value = existingProduct?.brand?.id;
      currentForm.colorId.value = existingProduct?.color?.id;
      setInventories(() => {
        return existingProduct?.inventories;
        // let localInventoryList = [];

        // for (inventory of existingProduct?.inventories) {
        //   existingProduct.inventories;
        //   localInventoryList.push({
        //     size: inventory.size,
        //     quantity: inventory.quantity,
        //   });
        // }
        // return localInventoryList;
      });
      setUploadedImages([existingProduct?.images, existingProduct?.mainImage]);
      setMainImage(existingProduct?.mainImage);
    } catch (error) {
      console.log(error);
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
  //     console.log(values);
  //   },
  // });
  const submitFormHandler = (e) => {
    e.preventDefault();
    console.log(form.current.description);
    const code = e.target.code.value;
    const productName = e.target.productName.value;
    const description = e.target.description.value;
    const price = e.target.price.value;
    const offPercent = e.target.offPercent.value;
    const material = e.target.material.value;
    const pattern = e.target.pattern.value;
    const height = e.target.height.value;
    const categoryId = searchParams.get("categoryId");
    const brandId = e.target.brandId.value;
    const colorId = e.target.colorId.value;

    // const imageIds = uploadedImages.map((uploadedImage) => {
    //   if (uploadedImage.id !== mainImage.id) {
    //     return uploadedImage.id;
    //   }
    // });
    const imageIds = uploadedImages
      .filter((uploadedImage) => {
        return uploadedImage.id !== mainImage.id;
      })
      .map((uploadedImage) => {
        return uploadedImage.id;
      });

    const mainImageId = mainImage.id;
    // todo validation
    setLoading(true);
    formApiHandler(
      searchParams.get("productId")
        ? "product/admin/update/" + searchParams.get("productId")
        : "product/admin/save",
      {
        code: code,
        productName: productName,
        description: description,
        price: price,
        offPercent: offPercent,
        material: material,
        pattern: pattern,
        height: height,
        categoryId: categoryId,
        brandId: brandId,
        colorId: colorId,
        inventories: inventories,
        imageIds: imageIds,
        mainImageId: mainImageId,
      },
      setToastList,
      setErrors,
      setLoading
    );
  };
  const loadcolorOptions = useCallback(findColorByName);
  const loadBrandOptions = useCallback(findBrandByName);

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
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">برند</span>
              </div>
              <ASelectBox
                loadOptions={loadBrandOptions}
                isSearchable={true}
                name="brandId"
              />
            </div>
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
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">جنس</span>
              </div>
              <Input iMessage={errors?.material} name="material" />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className="!leading-3">طرح</span>
              </div>
              <Input iMessage={errors?.pattern} name="pattern" />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">قد</span>
              </div>
              <Input iMessage={errors?.height} name="height" />
            </div>

            <div className="flex flex-col col-span-5 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">سایز</span>
              </div>
              <SelectBox
                name="inventorySize"
                options={[
                  { label: "xs", value: "XS" },
                  { label: "sm", value: "S" },
                ]}
              />
            </div>
            <div className="flex flex-col col-span-5 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">تعداد</span>
              </div>
              <Input
                iMessage={errors?.inventoryQuantity}
                name="inventoryQuantity"
                type="number"
              />
            </div>

            <div
              onClick={() => {
                insertInventory(form, inventories, setInventories);
              }}
              className="mt-4 cursor-pointer"
            >
              <i class="fa-solid fa-circle-plus fa-2x text-green-500"></i>
            </div>

            <div className=" col-span-12 grid grid-cols-12 ">
              {inventories.map((inventory) => {
                return (
                  <div className="flex justify-between col-span-4 p-3 border rounded">
                    <div>
                      <span>سایز:</span>
                      <span>{inventory.size}</span>
                    </div>
                    <div className="flex items-center">
                      <span>تعداد:</span>
                      <span>{inventory.quantity}</span>
                    </div>
                    <div
                      onClick={() =>
                        deleteInvetory(
                          inventory.size,
                          inventories,
                          setInventories
                        )
                      }
                      className="flex items-center cursor-pointer"
                    >
                      <i class="fas fa-window-close text-red-500"></i>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex ">
        <div className="mx-2 self-start">
          <i class="fa-solid fa-2x fa-square-plus text-purple-400"></i>
        </div>
        <div className="grow flex flex-col gap-y-10">
          <div className=" text-lg font-semibold">گام چهارم: اپلود عکس</div>
          <div className=" flex border justify-center items-center border-slate-500 border-dotted rounded-lg p-10 relative">
            {isUploading ? (
              <>
                <input
                  onChange={(e) =>
                    uploadImage(
                      e,
                      setUploadProgress,
                      setUploadedImages,
                      setIsUploading
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
                      setIsUploading
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
                    src={"http://localhost/" + image?.filePath}
                  ></img>
                  <span className=" text-sm text-slate-400">
                    {image?.filePath}
                  </span>
                </div>
                <div className="flex justify-around gap-x-4">
                  <div>
                    <i
                      onClick={() => setMainImage(image)}
                      data-mainImage={mainImage?.id === image?.id}
                      class="fa-solid fa-flag data-[mainImage=true]:text-sky-400 text-slate-400 "
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
              <span className=" text-sm text-slate-400">product93141.jpg</span>
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
        bgColor="bg-rose-500"
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
