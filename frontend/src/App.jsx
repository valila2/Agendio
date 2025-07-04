import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
//import PanelAdmin from "./pages/admin/PanelAdmin";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Eventos from "./pages/Eventos.jsx";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />
        <Route path="/eventos" element={<Eventos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
