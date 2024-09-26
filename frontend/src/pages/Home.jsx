import BeforePageLoading from "../components/beforepageloading/BeforePageLoading"
import MainLayout from "../components/mainlayout/MainLayout"
import MobileFooter from "../components/mobilefooter/MobileFooter"
import NavBar from "../components/navbar/NavBar"
import PageLoading from "../components/pageloading/PageLoading"

const Home=()=>{
    return( 
        <div className="home-page ">
             <NavBar/>
            <MobileFooter/>
            <MainLayout></MainLayout>
        </div>

    )
}
export default Home