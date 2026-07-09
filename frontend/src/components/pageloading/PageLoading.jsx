import brandImage from "../../assets/img/digi.png";
import Loading from "../icons/Loading";
import SmartImage from "../smartimage/SmartImage";
import MobileFooter from "../mobilefooter/MobileFooter";
import NavBar from "../navbar/NavBar";
const PageLoading = () => {
  return (
    <div className="relative">
      <NavBar></NavBar>
      <MobileFooter></MobileFooter>
      <div className=" fixed top-0 w-screen h-screen flex justify-center items-center bg-[var(--color-lightblack)] inset-0 ">
        <div className="glass-strong border border-[var(--glass-border)] p-10 rounded-2xl z-10 flex flex-col items-center ">
          <SmartImage className="w-[120px]" src={brandImage} alt="" ratio="3/1" />
          <Loading className="w-10 h-10 mt-10"></Loading>
        </div>
      </div>
    </div>
  );
};
export default PageLoading;
