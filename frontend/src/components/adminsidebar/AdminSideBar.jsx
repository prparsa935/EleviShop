import { useLocation, useNavigate } from "react-router";

const navItems = [
  {
    path: "/admin/product",
    label: "مدیریت کالا ها",
    icon: "fa-regular fa-bag-shopping",
  },
  {
    path: "/admin/stock",
    label: "مدیریت موجودی",
    icon: "fa-regular fa-boxes-stacked",
  },
  {
    path: "/admin/color",
    label: "مدیریت رنگ ها",
    icon: "fa-regular fa-bag-shopping",
  },
  {
    path: "/admin/category",
    label: "مدیریت گروه های کالایی",
    icon: "fa-regular fa-bag-shopping",
  },
];

const AdminSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
        <i className="far fa-edit gold-text"></i>
      </div>
      {navItems.map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          className={
            " justify-between items-center p-4 hover:bg-[var(--color-gold-light)] transition-colors rounded-xl cursor-pointer " +
            (location.pathname.startsWith(item.path)
              ? "bg-[var(--color-gold-light)]"
              : "")
          }
        >
          <div className="flex items-center gap-x-3  font-semibold text-[var(--color-white)] ">
            <i className={item.icon + " gold-text"}></i>
            <span className="">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminSideBar;
