const RateStar = ({ onClick, currentRate, starRate }) => {
  return (
    <i
      onClick={onClick}
      className={
        "fa fa-star  cursor-pointer " +
        (currentRate >= starRate ? "text-yellow-500" : "text-gray-400")
      }
      aria-hidden="true"
    ></i>
  );
};
export default RateStar;
