const Button = (props) => {
  const {
    size,
    shape,
    border,
    hoverClass,
    bgColor,
    txtColor,
    col,
    moreCss,
    icon,
    leftIcon,
    disabled,
    type,
    onClick,
    children,
    ...rest
  } = props;
  const sizeSetter = () => {
    if (shape === "rounded-full") {
      return "h6 p-2";
    }
    if (size) {
      if (size === "lg") {
        return "px-8 py-3 text-base font-bold ";
      } else if (size === "md") {
        return "px-6 py-2 text-sm font-semibold";
      } else if (size === "sm") {
        return "px-4  py-2 text-sm font-medium";
      } else if (size === "xs") {
        return "px-4  py-1 text-xs font-normal ";
      }
    }
    return "px-6 py-2 text-sm font-semibold";
  };
  const shapeSetter = () => {
    if (shape) {
      return shape;
    }
    return " rounded ";
  };
  const sizeCss = sizeSetter();
  const shapeCss = shapeSetter();

  return (
    <button
      {...rest}
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={
        "   duration-100   button flex items-center justify-center" +
        " " +
        (border ? border : "border") +
        " " +
        (hoverClass || "") +
        " " +
        sizeCss +
        " " +
        shapeCss +
        " " +
        (bgColor || "") +
        " " +
        (txtColor || "") +
        " " +
        (disabled ? " text-[var(--sub-text-color)] opacity-50" : "") +
        " " +
        (col ? "flex-col" : "") +
        " " +
        (moreCss || "")
      }
    >
      {icon ? <div className={col ? "mb-1" : "ml-1"}>{icon}</div> : <></>}

      {children}
      {leftIcon ? (
        <div className={col ? "mb-1" : "mr-1"}>{leftIcon}</div>
      ) : (
        <></>
      )}
    </button>
  );
};
export default Button;
