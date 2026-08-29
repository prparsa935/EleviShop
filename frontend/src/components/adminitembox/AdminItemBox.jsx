const AdminItemBox = ({ onDelete, onEdit, children }) => {
  return (
    <div className="glass glass-hover rounded-xl p-4 flex justify-between items-center mb-3">
      <div>{children}</div>
      <div className="flex gap-x-3">
        <div
          onClick={onEdit}
          className="cursor-pointer w-9 h-9 rounded-lg bg-bf-lighter-sky flex items-center justify-center transition-colors hover:bg-bf-sky hover:text-white"
        >
          <i className="fal fa-edit text-bf-sky"></i>
        </div>
        <div
          onClick={onDelete}
          className="cursor-pointer w-9 h-9 rounded-lg bg-bf-lighter-red flex items-center justify-center transition-colors hover:bg-bf-red hover:text-white"
        >
          <i className="fa-solid fa-trash text-bf-red"></i>
        </div>
      </div>
    </div>
  );
};
export default AdminItemBox;
