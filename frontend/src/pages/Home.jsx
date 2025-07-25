import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaUserTie, FaDollarSign } from "react-icons/fa";
import Navbar from "../components/shared/Navbar"; 

function Home() {
  const [rol, setRol] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No autorizado");
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setRol(decoded.rol);
    } catch (err) {
      toast.error("Token inválido");
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="fondo" >
      {/* Navbar reutilizable */}
      <Navbar/>

      {/* Tarjetas */}
      <div className="container py-5">
        <div className="row justify-content-center g-4">

          <div className="col-12 col-md-4">
            <div className="card shadow text-center h-100" onClick={() => navigate("/eventos")} style={{ cursor: "pointer" }}>
              <div className="card-body">
                <FaCalendarAlt size={50} className="text-primary mb-3" />
                <h5 className="card-title">EVENTOS</h5>
                <p className="card-text">Gestiona tus eventos fácilmente</p>
              </div>
            </div>
          </div>

          {rol === "admin" && (
            <div className="col-12 col-md-4">
              <div className="card shadow text-center h-100" onClick={() => navigate("/trabajadores")} style={{ cursor: "pointer" }}>
                <div className="card-body">
                  <FaUserTie size={50} className="text-primary mb-3" />
                  <h5 className="card-title">TRABAJADORES</h5>
                  <p className="card-text">Administra tu personal</p>
                </div>
              </div>
            </div>
          )}

          <div className="col-12 col-md-4">
            <div className="card shadow text-center h-100" onClick={() => navigate("/finanzas")} style={{ cursor: "pointer" }}>
              <div className="card-body">
                <FaDollarSign size={50} className="text-primary mb-3" />
                <h5 className="card-title">FINANZAS</h5>
                <p className="card-text">Visualiza y controla ingresos y gastos</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
