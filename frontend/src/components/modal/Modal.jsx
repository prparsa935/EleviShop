import { useEffect, useRef } from "react";
import "./modal.css";
const Modal = (props) => {
  const modalRef = useRef();
  const modalContent = useRef();
  const modalControl = (enable) => {
    if (!modalRef.current || !modalContent.current) {
      return;
    }
    if (!enable) {
      document.body.classList.remove("overflow-hidden");
      modalRef.current.classList.add("opa-0");
      modalContent.current.classList.add("scale-0");
      setTimeout(() => {
        modalRef.current.classList.add("hidden");
      }, 500);
    } else {
      modalRef.current.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
      modalRef.current.classList.remove("opa-0");
      modalContent.current.classList.remove("scale-0");
    }
  };
  useEffect(() => {
    modalControl(props.enable);
  }, [props.enable]);
  return (
    <div
      ref={modalRef}
      className={
        "fixed top-0 w-100 h-100vh flex justify-center bg-opacity-70 bg-[var(--color-lightblack)] duration-500 z-40 "
      }
    >
      <div
        ref={modalContent}
        style={{ height: props.height }}
        className={
          "text-[var(--color-white)] modal-content border border-[var(--glass-border)] relative scale-0 duration-500 self-center overflow-y-scroll " +
          props.className
        }
      >
        <div
          onClick={() => {
            props.setModalActive(false);
          }}
          role="button"
          className="dialog-close-btn text-[var(--color-white)]"
        >
          <i className="fa fa-times" aria-hidden="true"></i>
        </div>
        {props.children}
      </div>
    </div>
  );
};
export default Modal;