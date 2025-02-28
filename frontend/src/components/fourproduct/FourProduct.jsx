import imageExample1 from "../../assets/img/d96e7ea767ac9c2f0e4dc0316a625a276c5716df_1716971139.jpg";
import imageExample2 from "../../assets/img/fc62e7e61c856554dacc95025600657c94e4b260_1721815391.webp";
import imageExample3 from "../../assets/img/79afc4fed1f5185d940a55bafcc4575178438d0e_1722069910.webp";
import imageExample4 from "../../assets/img/0838826b3d938e102a3ac44f34084e4128adcfa4_1722320454.webp";
import { imageServerAddress, serverAddress } from "../../App";

const FourProduct = () => {
  return (
    <div className="container max-w-screen-xl lg:mx-auto  grid lg:grid-cols-4 grid-cols-2 gap-x-4 gap-y-4 justify-center px-3">
      <div className="flex justify-center">
        <img className=" rounded-2xl" src={imageExample1}></img>
      </div>
      <div className="flex justify-center">
        <img className=" rounded-2xl" src={imageServerAddress + "/102.jpg"}></img>
      </div>
      <div className="flex justify-center">
        <img className=" rounded-2xl" src={imageServerAddress+"/0838826b3d938e102a3ac44f34084e4128adcfa4_1722320454.jpg"}></img>
      </div>
      <div className="flex justify-center">
        <img className=" rounded-2xl" src={imageExample4}></img>
      </div>
    </div>
  );
};
export default FourProduct;
