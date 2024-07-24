import { useContext } from "react";
import MobileFooter from "../components/mobilefooter/MobileFooter";
import NavBar from "../components/navbar/NavBar";
import ProductInCartBox from "../components/productincartbox/ProductInCartBox";
import SubmitCartBox from "../components/submitcartbox/SubmitCartBox";
import AuthContext from "../context/AuthContext";

const Cart = () => {
  const { shoppingCart } = useContext(AuthContext);
  return (
    <div className="cart-page">
      <NavBar />
      <MobileFooter />
      <div className="mx-auto max-w-screen-xl">
        <div className="flex mt-10">
          {/* all cart products box */}
          <div className="grow flex flex-col border rounded-md ml-3 px-7 py-3">
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span className=" font-semibold text-lg">سبد خرید شما</span>
                <div>three dot</div>
              </div>
              <span className=" text-neutral-500 text-sm">{shoppingCart.length} کالا</span>
            </div>
            {shoppingCart.map((productInCart,index)=>(
               <ProductInCartBox productInCart={{productInCart:productInCart,productInCartIndex:index}}></ProductInCartBox>
            ))}
           
        
          
          </div>
          <div>
            <SubmitCartBox></SubmitCartBox>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
