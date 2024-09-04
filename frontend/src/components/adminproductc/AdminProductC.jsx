import { useNavigate } from "react-router";
import Button from "../Button/Button";
import Input from "../input/Input";
import AdminItemBox from "../adminitembox/AdminItemBox";
import productImageTest from "../../assets/img/a649d7004b7f54e113e5aa2130a7440d2e8c509d_1669105811.webp";
import SearchFilter from "../searchfilter/SearchFilter";
const AdminProductC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col border ">
      {/* header */}
      <div className=" m-5 p-2 border-b flex flex-col  ">
        <div className="flex justify-between items-center">
          <div>
            <Button
              onClick={() => navigate("/admin/product/save")}
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

        <div className="flex w-100 ">
          <SearchFilter></SearchFilter>
        </div>
      </div>
      <div className="">
        {[1, 2, 3].map((item, index) => {
          return (
            <AdminItemBox>
              <div className="flex items-center">
                <div>
                  <img className="w-[80px]" src={productImageTest}></img>
                </div>
                <h3 className=" lg:font-semibold">فنر تقویت مچ دست مدل MY</h3>
              </div>
            </AdminItemBox>
          );
        })}
      </div>
    </div>
  );
};
export default AdminProductC;
