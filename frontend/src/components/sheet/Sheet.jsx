import { useEffect } from "react";
import { createPortal } from "react-dom";

const sideClasses = {
  top: "top-0 left-0 right-0 data-[state=closed]:-translate-y-full",
  bottom: "bottom-0 left-0 right-0 data-[state=closed]:translate-y-full",
  left: "left-0 top-0 bottom-0 data-[state=closed]:-translate-x-full",
  right: "right-0 top-0 bottom-0 data-[state=closed]:translate-x-full",
};

const Sheet = ({ state, setState, className = "", side = "bottom", children }) => {
  const open = state === true || state === "open";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      <div
        data-state={open ? "open" : "closed"}
        onClick={() => setState(false)}
        className={
          "fixed inset-0 z-40 bg-black/60 duration-500 " +
          (open ? "opacity-100" : "opacity-0 pointer-events-none")
        }
      ></div>
      <div
        data-state={open ? "open" : "closed"}
        className={
          "fixed z-50 duration-500 transition-transform " +
          sideClasses[side] +
          " " +
          className
        }
      >
        <div className="relative w-100 h-100">
          <button
            type="button"
            onClick={() => setState(false)}
            aria-label="بستن"
            className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full glass flex items-center justify-center text-[var(--color-white)] cursor-pointer"
          >
            <i className="fa fa-times" aria-hidden="true"></i>
          </button>
          <div className="w-100 h-100 overflow-y-auto p-3">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
};
export default Sheet;
