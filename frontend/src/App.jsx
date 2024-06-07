// import './assets/bootstrap-5.0.2-dist/css/bootstrap.min.css'
// import './assets/bootstrap-5.0.2-dist/js/bootstrap.bundle'
import { Suspense,lazy } from 'react'
import './assets/FontAwesome.Pro.6.5.2/css/all.css'
import './assets/css/common.css'
import './assets/css/var.css'

import { Route, Router, Routes,BrowserRouter } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home.jsx'));
function App() {
  


  return (
    <BrowserRouter>


      <Routes>
        <Route path='/' element={
        <Suspense>
          <Home></Home>
 
        </Suspense>}/>
    

      </Routes>
    </BrowserRouter>
    
  )
}

export default App
