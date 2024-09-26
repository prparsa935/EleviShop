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
import PageLoading from "./components/pageloading/PageLoading.jsx";

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
const serverAddress = "https://elevishop.onrender.com/api/";
const imageServerAddress = "https://elevishop.onrender.com";

export { serverAddress, imageServerAddress };
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <Home></Home>
              </Suspense>
            }
          />
          <Route
            path="/search"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <Search></Search>
              </Suspense>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <Product></Product>
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <Login></Login>
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <Register></Register>
              </Suspense>
            }
          />
          <Route
            path="/cart"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <Cart></Cart>
              </Suspense>
            }
          />
          <Route
            path="/payment"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <Payment></Payment>
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <Profile></Profile>
              </Suspense>
            }
          />
          <Route
            path="/profile/orders"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <Orders></Orders>
              </Suspense>
            }
          />
          <Route
            path="/profile/orders/:orderId"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <OrderDetails></OrderDetails>
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <Admin></Admin>
              </Suspense>
            }
          />
          <Route
            path="/admin/brand"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
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
              <Suspense fallback={<PageLoading></PageLoading>}>
                <AdminCategory></AdminCategory>
              </Suspense>
            }
          />
          <Route
            path="/admin/product"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <AdminProduct></AdminProduct>
              </Suspense>
            }
          />

          <Route
            path="/admin/product/save"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <InsertProduct></InsertProduct>
              </Suspense>
            }
          />
          <Route
            path="/admin/category/save"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <InsertCategory></InsertCategory>
              </Suspense>
            }
          />
          <Route
            path="/admin/color/save"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
                <InsertColor></InsertColor>
              </Suspense>
            }
          />
          <Route
            path="/admin/brand/save"
            element={
              <Suspense fallback={<PageLoading></PageLoading>}>
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
