import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import {
  crearAsistente,
  obtenerAsistentes,
} from "../services/asistenteServices";
import RegistrarAsistenteModal from "../components/asistentes/RegistrarAsistenteModal";
import VerAsistenteModal from "../components/asistentes/VerAsistenteModal";

const VerAsistentes = () => {
  const { eventoId } = useParams();
  const [asistentes, setAsistentes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [nombreEvento, setNombreEvento] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [asistenteSeleccionadoId, setAsistenteSeleccionadoId] = useState(null);
  const [mostrarVerModal, setMostrarVerModal] = useState(false);

  const obtenerAsistentesEvento = async () => {
    try {
      const data = await obtenerAsistentes(eventoId);

      if (data.length > 0) {
        const evento = data[0].evento;
        setNombreEvento(evento?.nombre || "");

        const asistentesFormateados = data.map((a) => {
          const totalAbonos =
            a.pagos?.reduce((acc, pago) => acc + pago.valor, 0) || 0;
          const valor = evento?.valor || 0;
          const saldo = valor - totalAbonos;

          return {
            id: a._id,
            nombre: a.nombre,
            telefono: a.telefono,
            fecha: new Date(a.createdAt).toLocaleDateString("es-CO"),
            valor,
            abono: totalAbonos,
            saldo,
            estado: saldo <= 0 ? "Pagado" : "Pendiente",
          };
        });

        setAsistentes(asistentesFormateados);
      } else {
        setNombreEvento("(sin asistentes aún)");
        setAsistentes([]);
      }
    } catch (error) {
      console.error("Error al obtener asistentes:", error);
    }
  };

  const handleRegistrarAsistente = async (nuevoAsistente) => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      const userId = usuario?.id || usuario?._id; // según cómo venga del backend

      await crearAsistente({
        ...nuevoAsistente,
        evento: eventoId,
        registradoPor: userId, // o ajusta según tu lógica
        pagos: [
          {
            valor: nuevoAsistente.abono,
            recibidoPor: userId,
          },
        ],
      });

      setMostrarModal(false);
      obtenerAsistentesEvento(); // refrescar la lista
    } catch (error) {
      console.error("Error al registrar asistente:", error);
      alert(error.response?.data?.mensaje || "Error al registrar asistente");
    }
  };

  useEffect(() => {
    obtenerAsistentesEvento();
  }, [eventoId]);

  return (
    <div className="fondo">
      <Navbar />
      <div className="container mt-4">
        <h4>ASISTENTES - Evento {nombreEvento}</h4>

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
            <button
              className="btn btn-success"
              onClick={() => setMostrarModal(true)}
            >
              Registrar
            </button>
          </div>
        </div>

        <table className="table table-bordered table-hover">
          <thead className="table-primary">
            <tr>
              <th>Nombre</th>
              <th>FechaCreacion</th>
              <th>Valor del evento</th>
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
                  <button
                    className="btn btn-info btn-sm me-1"
                    onClick={() => {
                      setAsistenteSeleccionadoId(a.id);
                      setMostrarVerModal(true);
                    }}
                  >
                    Ver
                  </button>
                  <button className="btn btn-warning btn-sm me-1">
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm me-1">
                    Eliminar
                  </button>
                  <button className="btn btn-success btn-sm">Pago</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Aquí puedes poner paginación si necesitas */}
      </div>
      <VerAsistenteModal
        eventoId={eventoId}
        asistenteId={asistenteSeleccionadoId}
        show={mostrarVerModal}
        onClose={() => {
          setMostrarVerModal(false);
          setAsistenteSeleccionadoId(null);
        }}
      />

      <RegistrarAsistenteModal
        show={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onSubmit={handleRegistrarAsistente}
      />
    </div>
  );
};

export default VerAsistentes;
