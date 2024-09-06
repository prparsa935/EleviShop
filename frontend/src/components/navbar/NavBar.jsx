import { useContext, useEffect, useRef } from "react";
import Button from "../Button/Button";
import Input from "../input/Input";
import { useNavigate } from "react-router-dom";
import NavTab from "../navtab/NavTab";
import Separator from "../separator/Separator";
import AuthContext from "../../context/AuthContext";
import Badge from "../badge/Badge";
import Tag from "../tag/Tag";
import Categories from "../categories/Categories";
const NavBar = () => {
  const navEl = useRef();
  const { user, logout, shoppingCart } = useContext(AuthContext);

  const Navigate = useNavigate();
  const controlNavbar = () => {
    console.log(window.scrollY);
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
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  return (
    <header className=" lg:h-[144px] h-[96px]  ">
      <div className=" w-100   fixed border-b-2 z-40 bg-white">
        {/* upper side */}
        <div className="pb-3 mx-auto  mt-9 container max-w-screen-2xl flex lg:justify-between items-center px-5 ">
          {/* right */}
          <div className="flex items-center  w-100 lg:w-fit ">
            <div className="ml-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="115"
                height="30"
                viewBox="0 0 115 30"
              >
                <g fill="none" fill-rule="evenodd">
                  <g fill="#EE384E">
                    <g>
                      <g>
                        <path
                          d="M76.916 19.024h6.72v-8.78h-6.72c-1.16 0-2.24 1.061-2.24 2.195v4.39c0 1.134 1.08 2.195 2.24 2.195zm26.883 0h6.72v-8.78h-6.72c-1.16 0-2.24 1.061-2.24 2.195v4.39c0 1.134 1.08 2.195 2.24 2.195zM88.117 6.951v15.366c0 .484-.625 1.098-1.12 1.098l-2.24.023c-.496 0-1.12-.637-1.12-1.12v-.733l-1.017 1.196c-.31.413-1.074.634-1.597.634h-4.107c-3.604 0-6.721-3.063-6.721-6.586v-4.39c0-3.523 3.117-6.585 6.72-6.585h10.082c.495 0 1.12.613 1.12 1.097zm26.883 0v15.366c0 .484-.624 1.098-1.12 1.098l-2.24.023c-.496 0-1.12-.637-1.12-1.12v-.733l-1.017 1.196c-.31.413-1.074.634-1.597.634h-4.107c-3.604 0-6.721-3.063-6.721-6.586v-4.39c0-3.523 3.117-6.585 6.72-6.585h10.082c.495 0 1.12.613 1.12 1.097zm-74.675 3.293h-6.721c-1.16 0-2.24 1.061-2.24 2.195v4.39c0 1.134 1.08 2.195 2.24 2.195h6.72v-8.78zm4.48-3.293V23.78c0 3.523-3.117 6.22-6.72 6.22H34.62c-.515 0-1-.236-1.311-.638l-1.972-2.55c-.327-.424-.144-1.202.399-1.202h6.347c1.16 0 2.24-.696 2.24-1.83v-.365h-6.72c-3.604 0-6.72-3.063-6.72-6.586v-4.39c0-3.523 3.116-6.585 6.72-6.585h4.107c.514 0 1.074.405 1.437.731l1.177 1.098V6.95c0-.483.625-1.097 1.12-1.097h2.24c.496 0 1.12.613 1.12 1.097zM4.481 16.83c0 1.134 1.08 2.195 2.24 2.195h6.72v-8.78h-6.72c-1.16 0-2.24 1.061-2.24 2.195v4.39zM16.8 0c.497 0 1.121.613 1.121 1.098v21.22c0 .483-.624 1.097-1.12 1.097h-2.24c-.496 0-1.12-.613-1.12-1.098v-.732l-1.175 1.232c-.318.346-.932.598-1.44.598H6.722C3.117 23.415 0 20.352 0 16.829v-4.356c0-3.523 3.117-6.62 6.72-6.62h6.722V1.099c0-.485.624-1.098 1.12-1.098h2.24zm46.3 14.634L69.336 6.9c.347-.421.04-1.048-.513-1.048h-3.566c-.27 0-.525.119-.696.323l-6.314 7.727V1.098c0-.485-.625-1.098-1.12-1.098h-2.24c-.496 0-1.12.613-1.12 1.098v21.22c0 .483.624 1.097 1.12 1.097h2.24c.495 0 1.12-.614 1.12-1.098v-6.951l6.317 7.744c.17.207.428.328.7.328h3.562c.554 0 .86-.627.514-1.048l-6.24-7.756zM48.166 0c-.496 0-1.12.613-1.12 1.098v2.195c0 .484.624 1.097 1.12 1.097h2.24c.495 0 1.12-.613 1.12-1.097V1.098c0-.485-.625-1.098-1.12-1.098h-2.24zm0 5.854c-.496 0-1.12.613-1.12 1.097v15.366c0 .484.8 1.12 1.295 1.12l2.065-.022c.495 0 1.12-.614 1.12-1.098V6.951c0-.484-.625-1.097-1.12-1.097h-2.24zM21.282 0c-.495 0-1.12.613-1.12 1.098v2.195c0 .484.625 1.097 1.12 1.097h2.24c.496 0 1.12-.613 1.12-1.097V1.098c0-.485-.624-1.098-1.12-1.098h-2.24zm0 5.854c-.495 0-1.12.613-1.12 1.097v15.366c0 .484.625 1.098 1.12 1.098h2.24c.496 0 1.12-.614 1.12-1.098V6.951c0-.484-.624-1.097-1.12-1.097h-2.24zm73.556-4.756v21.22c0 .483-.625 1.097-1.12 1.097h-2.24c-.496 0-1.12-.614-1.12-1.098V1.097c0-.484.624-1.097 1.12-1.097h2.24c.495 0 1.12.613 1.12 1.098z"
                          transform="translate(-1235 -19) translate(-238) translate(1473 19)"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <form onSubmit={(e) => searchHandler(e)}>
              <Input
                name="searchInput"
                placeHolder="جستجو"
                inputclassName="text-slate-500 lg:w-96 md:w-90 "
                preffix={<i className="fal fa-search"></i>}
              />
            </form>
          </div>
          {/* left */}
          <div className="lg:flex hidden">
            <Badge
              position="top-full right-0"
              content={
                <Tag size="xs" bgColor="bg-rose-500" txtColor="text-white">
                  {shoppingCart.length}
                </Tag>
              }
            >
              <Button shape="rounded-lg" moreCss="" size="md">
                <i className=" font-medium fa-light fa-cart-shopping "></i>
              </Button>
            </Badge>

            {!user ? (
              <Button
                shape="rounded-lg"
                icon={<i class="fas fa-sign-in"></i>}
                morCss="border-2  "
                size="md"
              >
                ورود
                <Separator
                  orientation="vertical"
                  className={"bg-slate-400 mx-2"}
                ></Separator>{" "}
                ثبت نام
              </Button>
            ) : (
              <>
                <Button
                  shape="rounded-lg"
                  leftIcon={<i class="fa-light fa-angle-down  "></i>}
                  morCss="border-2  "
                  size="md"
                >
                  <i class="fa-regular fa-lg fa-user ml-2"></i>
                </Button>
                <Button
                  onClick={() => {
                    logout();
                  }}
                  shape="rounded-lg"
                  leftIcon={<i class="fas fa-sign-in"></i>}
                  morCss="border-2  "
                  size="sm"
                ></Button>
              </>
            )}
          </div>
        </div>
        {/* navbar */}
        <div
          ref={navEl}
          data-scrolled="false"
          className=" duration-300 h-0 overflow-hidden  data-[scrolled=false]:lg:h-12 data-[scrolled=false]:lg:overflow-visible  items-center px-5 mx-auto  container max-w-screen-2xl "
        >
          <div className="flex items-stretch">
            <NavTab 
            menu={<Categories></Categories>}>
              <Button
                size="md"
                border="none "
                icon={<i class="pl-2 fa-thin fa-bars"></i>}
              >
                دسته بندی کالا ها
              </Button>
            </NavTab>
            <Separator
              orientation="vertical"
              className={"bg-slate-400 mx-2 h-auto"}
            ></Separator>

            <NavTab>
              <Button
                txtColor="text-slate-600"
                size="xs"
                border="none "
                icon={<i class="fa-light fa-basket-shopping"></i>}
              >
                شگفت انگیز ها
              </Button>
            </NavTab>
            <NavTab>
              <Button
                txtColor="text-slate-600"
                size="xs"
                border="none "
                icon={<i class="fal fa-fire"></i>}
              >
                پرفروش ترین ها
              </Button>
            </NavTab>
            <NavTab>
              <Button
                txtColor="text-slate-600"
                size="xs"
                border="none "
                icon={<i class="fa-light fa-badge-dollar"></i>}
              >
                تخفیف ها
              </Button>
            </NavTab>
            <NavTab>
              <Button txtColor="text-slate-600" size="xs" border="none ">
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
