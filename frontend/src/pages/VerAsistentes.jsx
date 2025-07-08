import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

const VerAsistentes = () => {
  const { eventoId } = useParams();
  const [asistentes, setAsistentes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const obtenerAsistentes = async () => {
    try {
      // Simulando data por ahora
      const dataSimulada = [
        { id: 1, nombre: "Pedro", fecha: "2024-06-01", valor: 100000, abono: 50000, saldo: 50000, estado: "Pendiente" },
        { id: 2, nombre: "Lucía", fecha: "2024-06-01", valor: 80000, abono: 80000, saldo: 0, estado: "Pagado" },
      ];
      setAsistentes(dataSimulada);
    } catch (error) {
      console.error("Error al cargar asistentes:", error);
    }
  };

  useEffect(() => {
    obtenerAsistentes();
  }, [eventoId]);

  return (
    <div className="fondo">
      <Navbar />
      <div className="container mt-4">
        <h4>ASISTENTES - Evento {eventoId}</h4>

        <div className="row my-3">
          <div className="col-md-6">
            <label>Consulta por nombre:</label>
            <input
              type="text"
              className="form-control"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="col-md-6 d-flex align-items-end justify-content-end">
            <button className="btn btn-success">Registrar</button>
          </div>
        </div>

        <table className="table table-bordered table-hover">
          <thead className="table-primary">
            <tr>
              <th>Nombre</th>
              <th>FechaCreacion</th>
              <th>Valor</th>
              <th>Abono</th>
              <th>Saldo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asistentes.map((a) => (
              <tr key={a.id}>
                <td>{a.nombre}</td>
                <td>{a.fecha}</td>
                <td>{a.valor}</td>
                <td>{a.abono}</td>
                <td>{a.saldo}</td>
                <td>{a.estado}</td>
                <td>
                  <button className="btn btn-info btn-sm me-1">Ver</button>
                  <button className="btn btn-warning btn-sm me-1">Editar</button>
                  <button className="btn btn-danger btn-sm me-1">Eliminar</button>
                  <button className="btn btn-success btn-sm">Pago</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Aquí puedes poner paginación si necesitas */}
      </div>
    </div>
  );
};

export default VerAsistentes;
