import Button from "../Button/Button";
import Modal from "../modal/Modal";

const DeleteModal = ({ setDeleteModalActive, deleteModalActive, onDelete }) => {
  return (
    <Modal
      setModalActive={setDeleteModalActive}
      enable={deleteModalActive}
      className="lg:w-[550px] w-100 p-6 rounded-2xl glass-strong"
    >
      <div className="flex flex-col justify-between gap-y-10">
        <span className=" font-semibold text-[var(--color-white)]">
          ایا میخواهید این مورد را حذف کنید؟
        </span>
        <div className="flex gap-x-2">
          <Button
            onClick={() => setDeleteModalActive(false)}
            size="sm"
            bgColor="bg-[var(--color-gray353030)]"
            txtColor="text-[var(--color-white)]"
          >
            لغو
          </Button>
          <Button
            onClick={onDelete}
            bgColor="bg-[var(--bf-lighter-red)]"
            txtColor="text-[var(--bf-red)]"
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
