import { useNavigate } from "react-router";
import Button from "../Button/Button";
import Input from "../input/Input";
import AdminItemBox from "../adminitembox/AdminItemBox";

const AdminBrandC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col border ">
      {/* header */}
      <div className=" m-5 p-2 border-b flex justify-between items-center">
        <div>
          <Button
            onClick={() => navigate("/admin/brand/save")}
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
      <div>
        {[1, 2, 3].map((item, index) => {
          return (
            <AdminItemBox>
              <div className="flex">
                <h3 className=" font-semibold mx-4">نایک</h3>
                <span className="">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Architecto doloribus, facilis illum, deserunt omnis nemo
                  cupiditate non harum provident eum neque repellendus, repellat
                  rem quae ipsa accusantium minus. Culpa, enim?
                </span>
              </div>
            </AdminItemBox>
          );
        })}
      </div>
    </div>
  );
};
export default AdminBrandC;
