import AdSlider from "../adslider/AdSlider"
import FourProduct from "../fourproduct/FourProduct"
import OffProductsSlider from "../offproductsslider/OffProductsSlider"

const MainLayout=()=>{
    return(
        <div className=" mt-3 w-full gap-y-4 flex flex-col ">
            <AdSlider/>
            <OffProductsSlider/>
            <FourProduct/>

        </div>
    )

}
export default MainLayout