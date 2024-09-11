import Alert from "../alert/Alert";

const ToastList = ({ toastList }) => {
  return (
    <div className=" sticky top-24 w-100 h-0 z-50 ">
      {toastList?.map((toast) => {
        return (
          <Alert duration={5000} type={toast.type}>
            {toast.message}
          </Alert>
        );
      })}
    </div>
  );
};
export default ToastList;
