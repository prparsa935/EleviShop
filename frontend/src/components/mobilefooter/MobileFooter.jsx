import { useContext } from "react";
import Badge from "../badge/Badge";
import Button from "../Button/Button";
import Tag from "../tag/Tag";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router";

const MobileFooter = () => {
  const { user, logout, shoppingCart } = useContext(AuthContext);
  const navigate = useNavigate();
  const path = window.location.pathname;

  const activeColor = (p) =>
    path === p ? "text-[var(--color-gold)]" : "text-[var(--sub-text-color)]";

  return (
    <div className="glass-strong w-100 fixed flex justify-around items-center lg:hidden bottom-0 left-0 px-7 py-1 border-t border-[var(--glass-border)] z-50">
      <Button
        onClick={() => navigate("/")}
        col
        size="md"
        border="none "
        txtColor={activeColor("/")}
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
        txtColor={activeColor("/search")}
        col
        size="md"
        border="none "
        icon={<i class="fa-light fa-objects-column"></i>}
        onClick={() => navigate("/search")}
      >
        جست و جو
      </Button>
      <Badge
        position="top-1/2 right-0"
        content={
          <Tag size="xs" bgColor="bg-[var(--color-gold)]" txtColor="text-white">
            {shoppingCart.length}
          </Tag>
        }
      >
        <Button
          txtColor={activeColor("/cart")}
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
        txtColor={activeColor("/profile")}
        onClick={() => {
          user ? navigate("/profile") : navigate("/login");
        }}
        col
        size="md"
        border="none "
        icon={<i class="fa-light fa-user"></i>}
      >
        {user ? "پروفایل" : "ورود"}
      </Button>
    </div>
  );
};
export default MobileFooter;
