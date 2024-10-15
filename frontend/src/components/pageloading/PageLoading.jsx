import brandImage from "../../assets/img/digi.png";
import Loading from "../icons/Loading";
import MobileFooter from "../mobilefooter/MobileFooter";
import NavBar from "../navbar/NavBar";
const PageLoading = () => {
  return (
    <div className="relative">
      <NavBar></NavBar>
      <MobileFooter></MobileFooter>
      <div className=" fixed top-0 w-screen h-screen flex justify-center items-center bg-black  bg-opacity-50 inset-0 ">
        <div className="border bg-white p-10 rounded-2xl z-10 flex flex-col items-center ">
          <img className="w-[120px]" src={brandImage}></img>
          <Loading className="w-10 h-10 mt-10"></Loading>
        </div>
      </div>
    </div>
  );
};
export default PageLoading;
