import { useEffect, useRef } from "react";
import Border from "../border/Border";

const NavTab = (props) => {
  const navtabRef = useRef();
  const controlEnterTab = () => {
    navtabRef.current.childNodes.forEach((element) => {
      element.setAttribute("data-active", "true");
    });
  };
  const controlLeaveTab = () => {
    navtabRef.current.childNodes.forEach((element) => {
      element.setAttribute("data-active", "false");
    });
  };

  return (
    <div
      ref={navtabRef}
      className="relative   flex "
      onMouseLeave={controlLeaveTab}
      onMouseEnter={controlEnterTab}
    >
      <Border
        data-active="false"
        moreCss=" w-full duration-500 data-[active=false]:w-0 "
        border="border-b-2 border-red-500"
      ></Border>
      {props.children}
      <div
        data-active="false"
        className="absolute top-full right-0 data-[active=false]:hidden z-40  bg-white rounded-b-lg shadow-2xl"
      >
        {props.menu}
      </div>
    </div>
  );
};
export default NavTab;
