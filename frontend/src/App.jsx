// import './assets/bootstrap-5.0.2-dist/css/bootstrap.min.css'
// import './assets/bootstrap-5.0.2-dist/js/bootstrap.bundle'
import { Suspense, lazy } from "react";
import "./assets/FontAwesome.Pro.6.5.2/css/all.css";
import "./assets/css/common.css";
import "./assets/css/var.css";

import { Route, Router, Routes, BrowserRouter } from "react-router-dom";
import NavBar from "./components/navbar/NavBar.jsx";
import MobileFooter from "./components/mobilefooter/MobileFooter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

const Product = lazy(() => import("./pages/Product.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Search = lazy(() => import("./pages/Search.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Payment = lazy(() => import("./pages/Payment.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const OrderDetails = lazy(() => import("./pages/OrderDetails.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const AdminBrand = lazy(() => import("./pages/AdminBrand.jsx"));
const AdminColor = lazy(() => import("./pages/AdminColor.jsx"));
const AdminCategory = lazy(() => import("./pages/AdminCategory.jsx"));
const AdminProduct = lazy(() => import("./pages/AdminProduct.jsx"));

const InsertProduct = lazy(() => import("./pages/InsertProduct.jsx"));
const InsertCategory = lazy(() => import("./pages/InsertCategory.jsx"));
const InsertColor = lazy(() => import("./pages/InsertColor.jsx"));
const InsertBrand = lazy(() => import("./pages/InsertBrand.jsx"));
const serverAddress = "http://192.168.16.64/api/";
const imageServerAddress = "http://192.168.16.64";

export { serverAddress, imageServerAddress };
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense>
                <Home></Home>
              </Suspense>
            }
          />
          <Route
            path="/search"
            element={
              <Suspense>
                <Search></Search>
              </Suspense>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Suspense>
                <Product></Product>
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense>
                <Login></Login>
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense>
                <Register></Register>
              </Suspense>
            }
          />
          <Route
            path="/cart"
            element={
              <Suspense>
                <Cart></Cart>
              </Suspense>
            }
          />
          <Route
            path="/payment"
            element={
              <Suspense>
                <Payment></Payment>
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense>
                <Profile></Profile>
              </Suspense>
            }
          />
          <Route
            path="/profile/orders"
            element={
              <Suspense>
                <Orders></Orders>
              </Suspense>
            }
          />
          <Route
            path="/profile/orders/:orderId"
            element={
              <Suspense>
                <OrderDetails></OrderDetails>
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense>
                <Admin></Admin>
              </Suspense>
            }
          />
          <Route
            path="/admin/brand"
            element={
              <Suspense>
                <AdminBrand></AdminBrand>
              </Suspense>
            }
          />
          <Route
            path="/admin/color"
            element={
              <Suspense>
                <AdminColor></AdminColor>
              </Suspense>
            }
          />
          <Route
            path="/admin/category"
            element={
              <Suspense>
                <AdminCategory></AdminCategory>
              </Suspense>
            }
          />
          <Route
            path="/admin/product"
            element={
              <Suspense>
                <AdminProduct></AdminProduct>
              </Suspense>
            }
          />

          <Route
            path="/admin/product/save"
            element={
              <Suspense>
                <InsertProduct></InsertProduct>
              </Suspense>
            }
          />
          <Route
            path="/admin/category/save"
            element={
              <Suspense>
                <InsertCategory></InsertCategory>
              </Suspense>
            }
          />
          <Route
            path="/admin/color/save"
            element={
              <Suspense>
                <InsertColor></InsertColor>
              </Suspense>
            }
          />
          <Route
            path="/admin/brand/save"
            element={
              <Suspense>
                <InsertBrand></InsertBrand>
              </Suspense>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
