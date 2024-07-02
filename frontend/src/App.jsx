// import './assets/bootstrap-5.0.2-dist/css/bootstrap.min.css'
// import './assets/bootstrap-5.0.2-dist/js/bootstrap.bundle'
import { Suspense, lazy } from 'react'
import './assets/FontAwesome.Pro.6.5.2/css/all.css'
import './assets/css/common.css'
import './assets/css/var.css'

import { Route, Router, Routes, BrowserRouter } from 'react-router-dom'
import NavBar from './components/navbar/NavBar.jsx'
import MobileFooter from './components/mobilefooter/MobileFooter.jsx'



const Product = lazy(() => import('./pages/Product.jsx'));
const Home = lazy(() => import('./pages/Home.jsx'));
const Search = lazy(() => import('./pages/Search.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const serverAddress='http://192.168.77.64/'
export{serverAddress}
function App() {



  return (
    <BrowserRouter>


      <Routes>

        <Route path='/' element={
          <Suspense>
            <Home></Home>

          </Suspense>} />
        <Route path='/search' element={
          <Suspense>
            <Search></Search>

          </Suspense>} />
        <Route path='/product/:id' element={
          <Suspense>
            <Product></Product>

          </Suspense>} />
        <Route path='/login' element={
          <Suspense>
            <Login></Login>

          </Suspense>} />


      </Routes>
    </BrowserRouter>

  )
}

export default App
