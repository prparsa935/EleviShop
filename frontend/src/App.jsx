// import './assets/bootstrap-5.0.2-dist/css/bootstrap.min.css'
// import './assets/bootstrap-5.0.2-dist/js/bootstrap.bundle'
import { Suspense, lazy, useEffect } from "react";
import faCssUrl from "./assets/FontAwesome.Pro.6.5.2/css/all.css?url";
import "./assets/css/common.css";
import "./assets/css/var.css";

import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import NavBar from "./components/navbar/NavBar.jsx";
import MobileFooter from "./components/mobilefooter/MobileFooter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import PageLoading from "./components/pageloading/PageLoading.jsx";
import PageTransition from "./components/pagetransition/PageTransition.jsx";

const Product = lazy(() => import("./pages/Product.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Search = lazy(() => import("./pages/Search.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Verify = lazy(() => import("./pages/Verify.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Payment = lazy(() => import("./pages/Payment.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const OrderDetails = lazy(() => import("./pages/OrderDetails.jsx"));
const Admin = lazy(() => import("./pages/Admin.jsx"));
const AdminColor = lazy(() => import("./pages/AdminColor.jsx"));
const AdminCategory = lazy(() => import("./pages/AdminCategory.jsx"));
const AdminProduct = lazy(() => import("./pages/AdminProduct.jsx"));
const AdminStock = lazy(() => import("./pages/AdminStock.jsx"));

const InsertProduct = lazy(() => import("./pages/InsertProduct.jsx"));
const InsertCategory = lazy(() => import("./pages/InsertCategory.jsx"));
const InsertColor = lazy(() => import("./pages/InsertColor.jsx"));
const serverAddress = "http://localhost:8000/api/";
const imageServerAddress = "http://localhost:8000/";

export { serverAddress, imageServerAddress };

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <Home></Home>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/search"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <Search></Search>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/product/:id"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <Product></Product>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/login"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <Login></Login>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/verify"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <Verify></Verify>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/cart"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <Cart></Cart>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/payment"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <Payment></Payment>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/profile"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <Profile></Profile>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/profile/orders"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <Orders></Orders>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/profile/orders/:orderId"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <OrderDetails></OrderDetails>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/admin"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <Admin></Admin>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/admin/color"
        element={
          <PageTransition>
            <Suspense>
              <AdminColor></AdminColor>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/admin/category"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <AdminCategory></AdminCategory>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/admin/product"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <AdminProduct></AdminProduct>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/admin/stock"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <AdminStock></AdminStock>
            </Suspense>
          </PageTransition>
        }
      />

      <Route
        path="/admin/product/save"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <InsertProduct></InsertProduct>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/admin/category/save"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <InsertCategory></InsertCategory>
            </Suspense>
          </PageTransition>
        }
      />
      <Route
        path="/admin/color/save"
        element={
          <PageTransition>
            <Suspense fallback={<PageLoading></PageLoading>}>
              <InsertColor></InsertColor>
            </Suspense>
          </PageTransition>
        }
      />
    </Routes>
  );
}

function App() {
  // Load FontAwesome CSS without blocking first paint (icons fade in after).
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = faCssUrl;
    link.media = "print";
    link.onload = () => {
      link.media = "all";
    };
    document.head.appendChild(link);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
