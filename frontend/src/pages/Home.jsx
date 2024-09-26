import MainLayout from "../components/mainlayout/MainLayout";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";

const Home = () => {
  return (
    <div className="home-page ">
      <NavBar />
      <MobileFooter />
      <MainLayout></MainLayout>
    </div>
  );
};
export default Home;
