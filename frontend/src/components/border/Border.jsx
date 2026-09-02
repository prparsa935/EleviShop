const Border = (props) => {
  const { border, moreCss, ...rest } = props;
  return (
    <div
      {...rest}
      className={
        " bg-transparent -z-10 absolute  h-100  " +
        (border ? border : "border-b-2 border-red-500") +
        " " +
        (moreCss ? moreCss : "")
      }
    ></div>
  );
};
export default Border;
