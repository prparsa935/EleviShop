import { useEffect, useState } from "react";
import AdSlider from "../adslider/AdSlider";
import FourProduct from "../fourproduct/FourProduct";
import OffProductsSlider from "../offproductsslider/OffProductsSlider";
import { fetchOffProducts } from "../../api/productApi";

const MainLayout = () => {
  const [offProducts, setOffProducts] = useState([]);
  useEffect(() => {
    fetchOffProducts(setOffProducts);
  }, []);
  return (
    <div className=" mt-3 w-full gap-y-4 flex flex-col ">
      <AdSlider />
      <OffProductsSlider offProducts={offProducts} />
      <FourProduct />
    </div>
  );
};
export default MainLayout;
