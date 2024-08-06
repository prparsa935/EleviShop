import { useContext } from "react";
import Badge from "../badge/Badge";
import Button from "../Button/Button";
import Tag from "../tag/Tag";
import AuthContext from "../../context/AuthContext";

const MobileFooter = () => {
    const { user, logout, shoppingCart } = useContext(AuthContext);
  return (
    <div className="w-100 fixed flex justify-around items-center  lg:hidden bottom-0 left-0 px-7 py-3 border-t-2 bg-white z-50">
      <Button
        col
        size="md"
        border="none "
        icon={<i class="fa-light fa-house"></i>}
      >
        خانه
      </Button>
      <Button
        txtColor="text-slate-500"
        col
        size="md"
        border="none "
        icon={<i class="fa-light fa-objects-column"></i>}
      >
        دسته بندی
      </Button>
      <Badge
        position="top-1/2 right-0"
        content={
          <Tag size="xs" bgColor="bg-rose-500" txtColor="text-white">
            {shoppingCart.length}
          </Tag>
        }
      >
        <Button
          txtColor="text-slate-500"
          col
          size="md"
          border="none "
          icon={<i className=" font-medium fa-light fa-cart-shopping"></i>}
        >
          سبد
        </Button>
      </Badge>

      <Button
        txtColor="text-slate-500"
        col
        size="md"
        border="none "
        icon={<i class="fa-light fa-user"></i>}
      >
        پروفایل
      </Button>
    </div>
  );
};
export default MobileFooter;
