import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/shared/Navbar";
import ModalRegistrarTrabajador from "../components/trabajadores/ModalRegistrarTrabajador";

function Trabajadores() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [nuevoTrabajador, setNuevoTrabajador] = useState({
    nombre: '',
    rol: '',
    contacto: '',
    correo: '',
    contraseña: ''
  });

  useEffect(() => {
    axios.get('http://localhost:4000/api/trabajadores')
      .then(res => setTrabajadores(res.data))
      .catch(err => console.error('Error al cargar trabajadores:', err));
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoTrabajador({ ...nuevoTrabajador, [name]: value });
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/trabajadores', nuevoTrabajador);
      setTrabajadores([...trabajadores, res.data]);
      setNuevoTrabajador({
        nombre: '',
        rol: '',
        contacto: '',
        correo: '',
        contraseña: ''
      });

      // Cerrar el modal manualmente
      const modalElement = document.getElementById("modalRegistrarTrabajador");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();

    } catch (error) {
      console.error('Error al registrar trabajador:', error);
    }
  };

  return (
    <div className="fondo">
      <Navbar />
      <div className="container">
        <h2 className="mb-4">Gestión de Trabajadores</h2>

        <button
          className="btn btn-success mb-4"
          data-bs-toggle="modal"
          data-bs-target="#modalRegistrarTrabajador"
        >
          Registrar Trabajador
        </button>

        <ModalRegistrarTrabajador
          nuevoTrabajador={nuevoTrabajador}
          manejarCambio={manejarCambio}
          manejarRegistro={manejarRegistro}
        />

        <h4>Lista de Trabajadores</h4>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Contacto</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {trabajadores.map((t, index) => (
              <tr key={index}>
                <td>{t.nombre}</td>
                <td>{t.rol}</td>
                <td>{t.contacto}</td>
                <td>{t.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Trabajadores;
