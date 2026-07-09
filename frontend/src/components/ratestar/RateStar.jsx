const RateStar = ({ onClick, currentRate, starRate }) => {
  return (
    <i
      onClick={onClick}
      className={
        "fa fa-star cursor-pointer " +
        (currentRate >= starRate
          ? "text-[var(--color-yellow)]"
          : "text-[var(--sub-text-color)]")
      }
      aria-hidden="true"
    ></i>
  );
};
export default RateStar;