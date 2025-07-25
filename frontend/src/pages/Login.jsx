import { useState } from "react";
import { login } from "../services/authServices.js";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import "../styles/login.css";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Verificar si hay campos vacíos
    if (!correo || !contrasena) {
      setError("Por favor, completa todos los campos.");
      setTimeout(() => setError(""), 4000);
      return;
    }
    try {
      const data = await login(correo, contrasena);
      localStorage.setItem("token", data.token);
      toast.success("Inicio de sesión exitoso");

      const datos = jwtDecode(data.token);
      localStorage.setItem("usuario", JSON.stringify(datos));

      navigate("/home");
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje || "Error desconocido al iniciar sesión";
      setError(mensaje);

      // Limpiar el error después de 4 segundos
      setTimeout(() => setError(""), 4000);
    }
  };

  return (
    <div className="login-container">
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div
          className="login-card card p-4"
          style={{ maxWidth: 400, width: "100%" }}
        >
          <h4 className="text-center mb-3">Iniciar sesión</h4>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Correo</label>
              <input
                type="email"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
