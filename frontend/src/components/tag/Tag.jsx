import { useEffect, useState } from "react";

const Tag = (props) => {
  const sizeSetter = () => {
    if (props.size) {
      const size = props.size;

      if (size === "lg") {
        return "px-4 py-2 text-base";
      } else if (size === "md") {
        return "px-3 py-2 text-sm";
      } else if (size === "sm") {
        return "px-3 py-1 text-sm";
      } else if (size === "xs") {
        return "px-2 py-[2px]  text-xs";
      }
    } else {
      return " px-4 py-2 h6 ";
    }
  };
  const [sizeCss, setSizeCss] = useState(sizeSetter());

  useEffect(() => {
    console.log(props.iconCss);
  }, []);
  return (
    <div className="inline-block">
      <div
        onClick={props.onClick}
        className={
          "flex rounded-full items-center justify-center   font-semibold   " +
          " " +
          sizeCss +
          " " +
          props.bgColor +
          " " +
          props.txtColor +
          " " +
          (props.disabled ? "text-secondary" : "") +
          (props.border ? " border border-color " : "") +
          " " +
          props.morCss
        }
      >
        {props.prefix ? <div className="ml-1">{props.prefix}</div> : <></>}
        {props.children}
        {props.affix ? <div className="mr-1">{props.affix}</div> : <></>}
      </div>
    </div>
  );
};
export default Tag;
