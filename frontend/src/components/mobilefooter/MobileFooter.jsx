import { useContext } from "react";
import Badge from "../badge/Badge";
import Button from "../Button/Button";
import Tag from "../tag/Tag";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router";

const MobileFooter = () => {
  const { user, logout, shoppingCart } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="w-100 fixed flex justify-around items-center  lg:hidden bottom-0 left-0 px-7 py-1 border-t-2 bg-white z-50">
      <Button
        onClick={() => navigate("/")}
        col
        size="md"
        border="none "
        txtColor={
          window.location.pathname === "/" ? "text-black" : "text-slate-500"
        }
        icon={
          <i
            data-href={window.location.pathname}
            className="fa-light fa-house "
          ></i>
        }
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
          txtColor={
            window.location.pathname === "/cart"
              ? "text-black"
              : "text-slate-500"
          }
          onClick={() => navigate("/cart")}
          col
          size="md"
          border="none "
          icon={<i className=" font-medium fa-light fa-cart-shopping"></i>}
        >
          سبد
        </Button>
      </Badge>

      <Button
        txtColor={
          window.location.pathname === "/profile"
            ? "text-black"
            : "text-slate-500"
        }
        onClick={() => navigate("/profile")}
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
