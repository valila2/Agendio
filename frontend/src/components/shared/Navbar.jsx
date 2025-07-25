// src/components/Navbar.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const navigate = useNavigate();
  const [rol, setRol] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRol(decoded.rol);
      } catch (error) {
        toast.error("Token inválido");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      toast.error("No autorizado");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Sesión cerrada");
    navigate("/login");
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
