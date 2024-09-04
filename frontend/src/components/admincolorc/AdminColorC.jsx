import { useNavigate } from "react-router";
import Button from "../Button/Button";
import Input from "../input/Input";
import AdminItemBox from "../adminitembox/AdminItemBox";

const AdminColorC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col border ">
      {/* header */}
      <div className=" m-5 p-2 border-b flex justify-between items-center">
        <div>
          <Button
            onClick={() => navigate("/admin/color/save")}
            size="xs"
            bgColor="bg-green-100"
            txtColor="text-green-800"
          >
            افزودن +
          </Button>
        </div>

        <div className="flex items-stretch">
          <div className="h-[30px]">
            <Input height="30px" inputclassName=""></Input>
          </div>

          <div>
            <Button
              moreCss="border-r-0 rounded-r-none h-[30px] "
              bgColor="bg-sky-100"
              size="sm"
            >
              جست و جو
            </Button>
          </div>
        </div>
      </div>
      <div className="">
        {[1, 2, 3].map((item, index) => {
          return (
            <AdminItemBox>
              <div className="flex items-center">
                <div className=" w-8 h-8 rounded-full bg-black mx-3"></div>
                <h3 className="">مشکی</h3>
              </div>
            </AdminItemBox>
          );
        })}
      </div>
    </div>
  );
};
export default AdminColorC;
