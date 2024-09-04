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
const InsertProductForm = () => {
  const form = useRef();
  const [inventories, setInventories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  return (
    <form ref={form} className="insert-product-form flex flex-col gap-y-10">
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
              <Input />
            </div>
            <div className="flex flex-col col-span-6 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">قیمت</span>
              </div>
              <Input />
            </div>

            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">برند</span>
              </div>
              <ASelectBox />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">رنگ</span>
              </div>
              <ASelectBox />
            </div>
            <div className="flex flex-col col-span-12 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">توضیحات</span>
              </div>
              <Input type="textarea" />
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
              <Input />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className="!leading-3">طرح</span>
              </div>
              <Input />
            </div>
            <div className="flex flex-col col-span-4 ">
              <div className="mb-2 font-medium text-sm !leading-3 ">
                <span className=" text-red-500 text-lg !leading-3 ">*</span>
                <span className="!leading-3">قد</span>
              </div>
              <Input />
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
              <Input name="inventoryStock" type="number" />
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
                      <span>{inventory.stock}</span>
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
                <ProgressBar className="h-[20px]" persentage={90}></ProgressBar>
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
                    <i class="fa-solid fa-flag text-sky-400"></i>
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
    </form>
  );
};
export default InsertProductForm;