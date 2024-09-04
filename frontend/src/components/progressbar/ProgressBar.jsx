const ProgressBar = (props) => {
  return (
    <div
      className={
        "flex w-full bg-gray-200 rounded-full overflow-hidden  " +
        props.className
      }
      role="progressbar"
      aria-valuenow="25"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      {/* <div className={"progress "+props.moreClass}>
            <div  style={{width:`${(props.value/props.max)*100}%`}} className={"progress-bar "+props.color} role="progressbar"  aria-valuenow={`${props.value}`} aria-valuemin="0" aria-valuemax={`${props.max}`}>{props.content}</div>
        </div> */}
      <div
        class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-300 text-xs text-white text-center whitespace-nowrap transition duration-500 "
        style={{ width: props.persentage+'%' }}
      ></div>
    </div>
  );
};
export default ProgressBar;
