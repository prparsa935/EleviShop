import { useEffect, useState } from "react";

const Button = (props) => {
  const sizeSetter = () => {
    if (props.shape === "rounded-full") {
      return "h6 p-2";
    }
    if (props.size) {
      const size = props.size;

      if (size === "lg") {
        return "px-8 py-3 text-base font-bold ";
      } else if (size === "md") {

        return "px-6 py-2 text-sm font-semibold";
      } else if (size === "sm") {
        return "px-4  py-2 text-sm font-medium";
      } else if (size === "xs") {
        return "px-4  py-1 text-xs font-normal ";
      }
    } else {
      return "px-6 py-2 text-sm font-semibold";
    }
  };
  const shapeSetter = () => {
    if (props.shape) {
      return props.shape;
    } else {
      return " rounded ";
    }
  };
  const [sizeCss, setSizeCss] = useState(sizeSetter());
  const [shapeCss, setShapeCss] = useState(shapeSetter());

  return (
    <button
      {...props}
      disabled={props.disabled}
      type={props.type}
      onClick={props.onClick}
      className={
        "   duration-100   button flex items-center justify-center" +
        " " +
        (props.border ? props.border : "border") +
        " " +
        props.hoverClass +
        " " +
        sizeCss +
        " " +
        shapeCss +
        " " +
        props.bgColor +
        " " +
        props.txtColor +
        " " +
        (props.disabled ? " text-slate-500" : "") +
        " " +
        (props.col ? "flex-col" : "") +
        " " +
        props.moreCss
      }
    >
      {props.icon ? (
        <div className={props.col ? "mb-1" : "ml-1"}>{props.icon}</div>
      ) : (
        <></>
      )}

      {props.children}
      {props.leftIcon ? (
        <div className={props.col ? "mb-1" : "mr-1"}>{props.leftIcon}</div>
      ) : (
        <></>
      )}
    </button>
  );
};
export default Button;
