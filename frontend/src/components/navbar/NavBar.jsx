import { useContext, useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import Input from "../input/Input";
import { Link, useNavigate } from "react-router-dom";
import NavTab from "../navtab/NavTab";
import Separator from "../separator/Separator";
import AuthContext from "../../context/AuthContext";
import Badge from "../badge/Badge";
import Tag from "../tag/Tag";
import Categories from "../categories/Categories";
import ThemeToggle from "../themetoggle/ThemeToggle";
import logo from "../../assets/img/digi.png";
import { imageServerAddress } from "../../App";
import SmartImage from "../smartimage/SmartImage";

const NavBar = () => {
  const navEl = useRef();
  const navigate = useNavigate();
  const { user, logout, shoppingCart } = useContext(AuthContext);
  const Navigate = useNavigate();

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      navEl.current.setAttribute("data-scrolled", "true");
    } else {
      navEl.current.setAttribute("data-scrolled", "false");
    }
  };
  const searchHandler = (e) => {
    e.preventDefault();
    Navigate(`/search?name=${e.target.searchInput.value}`);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, []);

  return (
    <header className=" lg:h-[144px] h-[96px]  ">
      <div className="glass-strong w-100 fixed border-b border-[var(--glass-border)] z-40">
        <div className="pb-3 mx-auto mt-9 container max-w-screen-2xl flex lg:justify-between items-center px-5 ">
          <div className="flex items-center w-100 lg:w-fit ">
            <div className="ml-5">
              <SmartImage
                src={logo}
                onClick={() => navigate("/")}
                className="cursor-pointer w-[150px] h-[50px] object-contain drop-shadow-sm"
                alt="EleviShop"
                eager
                ratio="3/1"
              />
            </div>
            <form onSubmit={(e) => searchHandler(e)} className=" ">
              <Input
                name="searchInput"
                placeHolder="جستجو در محصولات و سرویس‌ها"
                inputclassName="text-[var(--color-white)] bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl focus:ring-2 focus:ring-[var(--color-gold)]/40 lg:w-96 md:w-90 backdrop-blur-md"
                preffix={<i className="fal fa-search text-[var(--color-gold)]"></i>}
              />
            </form>
          </div>
          <div className="lg:flex hidden items-center gap-x-3">
            <ThemeToggle />

            <Badge
              position="top-full right-0"
              content={
                <Tag size="xs" bgColor="bg-[var(--color-gold)]" txtColor="text-white">
                  {shoppingCart.length}
                </Tag>
              }
            >
              <Button
                onClick={() => navigate("/cart")}
                shape="rounded-xl"
                bgColor="bg-[var(--glass-bg)]"
                txtColor="text-[var(--color-white)]"
                border="border border-[var(--glass-border)]"
                size="md"
              >
                <i className="font-medium fa-light fa-cart-shopping"></i>
              </Button>
            </Badge>

            {!user ? (
              <Button
                shape="rounded-xl"
                icon={<i className="fas fa-sign-in"></i>}
                bgColor="bg-[var(--color-gold)]"
                txtColor="text-white"
                border="border border-[var(--color-gold-soft)]"
                hoverClass="hover:brightness-105"
                size="md"
              >
                <Link to={"/login"}>ورود</Link>
                <Separator orientation="vertical" className={"bg-[var(--glass-border)] mx-2"}></Separator>{" "}
                <Link to={"/register"}>ثبت نام</Link>
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/profile")}
                  shape="rounded-xl"
                  bgColor="bg-[var(--glass-bg)]"
                  txtColor="text-[var(--color-white)]"
                  border="border border-[var(--glass-border)]"
                  leftIcon={<i className="fa-light fa-angle-down"></i>}
                  size="md"
                >
                  <i className="fa-regular fa-lg fa-user ml-2"></i>
                </Button>
                <Button
                  onClick={() => logout()}
                  shape="rounded-xl"
                  bgColor="bg-[var(--glass-bg)]"
                  txtColor="text-[var(--bf-red)]"
                  border="border border-[var(--glass-border)]"
                  leftIcon={<i className="fas fa-sign-in"></i>}
                  size="sm"
                ></Button>
              </>
            )}
          </div>
        </div>
        <div
          ref={navEl}
          data-scrolled="false"
          className=" duration-300 h-0 overflow-hidden border-t border-[var(--glass-border)] data-[scrolled=false]:lg:h-12 data-[scrolled=false]:lg:overflow-visible items-center px-5 mx-auto container max-w-screen-2xl "
        >
          <div className="flex items-stretch">
            <NavTab menu={<Categories></Categories>}>
              <Button
                size="md"
                border="none"
                txtColor="text-[var(--color-white)]"
                icon={<i className="pl-2 fa-solid fa-bars"></i>}
              >
                دسته بندی کالا ها
              </Button>
            </NavTab>
            <Separator orientation="vertical" className={"bg-[var(--glass-border)] mx-2 h-auto"}></Separator>
            <NavTab>
              <Button
                onClick={() => navigate("/search?enableOff=true")}
                txtColor="text-[var(--color-gold)]"
                size="xs"
                border="none "
                icon={<i className="fa-light fa-basket-shopping"></i>}
              >
                شگفت انگیز ها
              </Button>
            </NavTab>
            <NavTab>
              <Button
                txtColor="text-[var(--color-gold)]"
                size="xs"
                border="none "
                icon={<i className="fal fa-fire text-[var(--bf-red)]"></i>}
              >
                پرفروش ترین ها
              </Button>
            </NavTab>
            <NavTab>
              <Button
                onClick={() => navigate("/search?enableOff=true")}
                txtColor="text-[var(--color-gold)]"
                size="xs"
                border="none "
                icon={<i className="fa-light fa-badge-dollar"></i>}
              >
                تخفیف ها
              </Button>
            </NavTab>
            <NavTab>
              <Button txtColor="text-[var(--sub-text-color)]" size="xs" border="none">
                سوالی دارید ؟
              </Button>
            </NavTab>
          </div>
        </div>
      </div>
    </header>
  );
};
export default NavBar;