const AddressInOrder = () => {
  return (
    <div className="flex flex-col border rounded-md ml-3 px-7 py-3 mb-3">
      <div className="flex">
        <div className="items-center flex ml-3 text-xl">
          <i class="fa-regular fa-location-dot"></i>
        </div>

        <div className="flex flex-col font-medium">
          <span className=" text-neutral-400">آدرس تحویل سفارش</span>
          <span className="font-medium ">
            بل رسول زاده، خ. سرو، خ. نیلوفر دوم
          </span>
          <span className=" text-neutral-400"> پارسا رجبی</span>
        </div>
      </div>

      <div className="flex justify-end text-sky-500 font-medium ">
        <span className="mx-3">تغییر یا ویرایش ادرس</span>
        <span>
          <i class="fa-light fa-angle-left"></i>
        </span>
      </div>
    </div>
  );
};
export default AddressInOrder;
