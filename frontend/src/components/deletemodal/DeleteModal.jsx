import Button from "../Button/Button";
import Modal from "../modal/Modal";

const DeleteModal = ({ setDeleteModalActive, deleteModalActive, onDelete }) => {
  return (
    <Modal
      setModalActive={setDeleteModalActive}
      enable={deleteModalActive}
      className="lg:w-[550px] w-100 p-6 rounded-2xl  "
    >
      <div className="flex flex-col justify-between gap-y-10">
        <span className=" font-semibold">
          ایا میخواهید این مورد را حذف کنید؟
        </span>
        <div className="flex gap-x-2">
          <Button
            onClick={() => setDeleteModalActive(false)}
            size="sm"
            bgColor="bg-slate-200"
          >
            لغو
          </Button>
          <Button
            onClick={onDelete}
            bgColor="bg-red-200"
            txtColor="text-red-700"
            size="sm"
          >
            حذف
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default DeleteModal;
