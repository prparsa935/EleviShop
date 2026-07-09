import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import './assets/bootstrap-5.0.2-dist/css/bootstrap.min.css'

const savedTheme = localStorage.getItem("theme");
const initialTheme = savedTheme === "dark" ? "dark" : "light";
document.documentElement.setAttribute("data-theme", initialTheme);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Fragment>
    <App />
  </React.Fragment>,
)
