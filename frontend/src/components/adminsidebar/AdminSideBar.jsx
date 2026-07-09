import { useNavigate } from "react-router";

const AdminSideBar = () => {
  const navigate = useNavigate();
  return (
    <div className="glass flex flex-col  gap-y-4 rounded-2xl">
      <div className="flex justify-between items-center p-4">
        <div className="flex flex-col">
          <div className="lg:text-lg font-semibold text-[var(--color-white)]">
            <span className="ml-1 ">پارسا</span>
            <span>رجبی</span>
          </div>
          <span className=" text-[var(--sub-text-color)]">۰۹۰۲۶۶۹۹۷۲۳</span>
        </div>
        <i class="far fa-edit gold-text"></i>
      </div>
      <div
        onClick={() => navigate("/admin/product")}
        className=" justify-between items-center p-4 hover:bg-[var(--color-gold-light)] transition-colors rounded-xl "
      >
        <div className="flex items-center gap-x-3  font-semibold text-[var(--color-white)] ">
          <i class="fa-regular fa-bag-shopping gold-text"></i>
          <span className="">مدیریت کالا ها</span>
        </div>
      </div>
      <div
        onClick={() => navigate("/admin/brand")}
        className=" justify-between items-center p-4 hover:bg-[var(--color-gold-light)] transition-colors rounded-xl "
      >
        <div className="flex items-center gap-x-3  font-semibold text-[var(--color-white)] ">
          <i class="fa-regular fa-bag-shopping gold-text"></i>
          <span className="">مدیریت برند ها</span>
        </div>
      </div>
      <div
        onClick={() => navigate("/admin/color")}
        className=" justify-between items-center p-4 hover:bg-[var(--color-gold-light)] transition-colors rounded-xl "
      >
        <div className="flex items-center gap-x-3  font-semibold text-[var(--color-white)] ">
          <i class="fa-regular fa-bag-shopping gold-text"></i>
          <span className="">مدیریت رنگ ها</span>
        </div>
      </div>
      <div
        onClick={() => navigate("/admin/category")}
        className=" justify-between items-center p-4 hover:bg-[var(--color-gold-light)] transition-colors rounded-xl "
      >
        <div className="flex items-center gap-x-3  font-semibold text-[var(--color-white)] ">
          <i class="fa-regular fa-bag-shopping gold-text"></i>
          <span className="">مدیریت گروه های کالایی </span>
        </div>
      </div>
    </div>
  );
};
export default AdminSideBar;
