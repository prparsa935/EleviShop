import SelectCategoryList from "../selectcategorylist/SelectCategoryList";
import categories from "../../jsons/categories.json";
import Input from "../input/Input";
import productImageTest from "../../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp";
import ASelectBox from "../selectbox/ASelectBox";
import SelectBox from "../selectbox/SelectBox";
import { useEffect, useRef, useState } from "react";
import { deleteInvetory, insertInventory } from "../../utils/helperMehods";
import { uploadImage } from "../../api/uploadImage";
import ProgressBar from "../progressbar/ProgressBar";
import { serverAddress } from "../../App";
import { useSearchParams } from "react-router-dom";
import Button from "../Button/Button";
import formApiHandler from "../../api/form";
import { fetchSingleProduct } from "../../api/productApi";
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
  const [isUploading, setIsUploading] = useState(false);
  const [mainImage, setMainImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  // useEffect(() => {
  //   form.current.code.value;
  //   fetchSingleProduct(searchParams.get("productId"));
  //   // todo declear product state and use useeffect([product])
  //   form.current.target.code.value = product.code;
  //   form.current.target.productName.value = product.productName;
  //   form.current.target.description.value = product.description;
  //   form.current.target.price.value = product.price;
  //   form.current.target.offPercent.value = product.offPercent;
  //   form.current.target.material.value = product.material;
  //   form.current.target.height.value = product.height;
  //   // todo categoy lis is comming we fucked
  //   // e.target.categoryId.value = product.category;
  //   form.current.target.brandId.value = product.brandId;
  //   form.current.target.colorId.value = product.colorId;
  //   setUploadedImages(product.images, product.mainImage);
  //   setMainImage(product.mainImage);
  // }, []);
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
    const productId = searchParams.get("productId");

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

    const imageIds = uploadedImages.map((uploadedImage) => {
      if (uploadedImage.id !== mainImage.id) {
        return uploadedImage.id;
      }
    });

    const mainImageId = mainImage.id;
    // todo validation
    formApiHandler(
      searchParams.get("productId")
        ? "product/update/" + searchParams.get("productId")
        : "product/save",
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
      setErrors
    );
  };

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
            <SelectCategoryList categories={categories} />
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
            <div className="flex flex-col col-span-6 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">نام فارسی کالا</span>
              </div>
              <Input iMessage={errors["productName"]} name="productName" />
            </div>
            <div className="flex flex-col col-span-3 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">قیمت</span>
              </div>
              <Input iMessage={errors["price"]} name="price" />
            </div>
            <div className="flex flex-col col-span-3 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className="!leading-3">درصد تخفیف</span>
              </div>
              <Input iMessage={errors["offPercent"]} name="offPercent" />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">کد</span>
              </div>
              <Input iMessage={errors["code"]} name="code" />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">برند</span>
              </div>
              <ASelectBox name="brandId" />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">رنگ</span>
              </div>
              <ASelectBox name="colorId" />
            </div>
            <div className="flex flex-col col-span-12 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">توضیحات</span>
              </div>
              <Input
                iMessage={errors["description"]}
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
              <Input iMessage={errors["material"]} name="material" />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className="!leading-3">طرح</span>
              </div>
              <Input iMessage={errors["pattern"]} name="pattern" />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">قد</span>
              </div>
              <Input iMessage={errors["height"]} name="height" />
            </div>

            <div className="flex flex-col col-span-5 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">سایز</span>
              </div>
              <SelectBox
                name="inventorySize"
                options={[
                  { label: "xs", value: "xs" },
                  { label: "sm", value: "sm" },
                ]}
              />
            </div>
            <div className="flex flex-col col-span-5 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">تعداد</span>
              </div>
              <Input
                iMessage={errors["inventoryQuantity"]}
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
                      data-mainImage={mainImage.id === image.id}
                      class="fa-solid fa-flag data-[mainImage]:text-sky-400 text-slate-400 "
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
      <Button type="submit">da</Button>
    </form>
  );
};
export default InsertProductForm;
