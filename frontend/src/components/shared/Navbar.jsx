// src/components/Navbar.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar({ rol }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-3 border bg-white">
      <h4 className="m-0">AGENDIO</h4>
      <div className="d-flex align-items-center gap-2">
        <span>Bienvenido {rol}</span>
        <button className="btn btn-sm btn-primary" onClick={handleLogout}>
          CERRAR SESIÓN
        </button>
      </div>
    </div>
  );
}

export default Navbar;
