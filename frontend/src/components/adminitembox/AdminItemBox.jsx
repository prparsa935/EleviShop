const AdminItemBox = ({ rightContent, onDelete, onEdit, children }) => {
  return (
    <div className="border flex justify-between  items-center  rounded-lg p-10">
      <div>{children}</div>
      <div className="flex justify-around gap-x-4">
        <div onClick={onEdit} className=" cursor-pointer">
          <i class="fal fa-edit text-sky-400"></i>
        </div>
        <div onClick={onDelete} className=" cursor-pointer">
          <i class="fa-solid fa-trash text-red-400"></i>
        </div>
      </div>
    </div>
  );
};
export default AdminItemBox;
