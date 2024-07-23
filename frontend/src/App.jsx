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
const serverAddress = "http://localhost/api/";
export { serverAddress };
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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
