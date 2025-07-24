import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as bootstrap from "bootstrap";
import Navbar from "../components/shared/Navbar";
import {
  crearAsistente,
  obtenerAsistentes,
  eliminarAsistente,
} from "../services/asistenteServices";
import { toast } from "react-toastify";
import RegistrarAsistenteModal from "../components/asistentes/RegistrarAsistenteModal";
import VerAsistenteModal from "../components/asistentes/VerAsistenteModal";
import ModalConfirmacion from "../components/shared/ModalConfirmacion";
import ModalPagoAsistente from "../components/asistentes/ModalPagoAsistente";

const VerAsistentes = () => {
  const { eventoId } = useParams();
  const [asistentes, setAsistentes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [nombreEvento, setNombreEvento] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [asistenteSeleccionadoId, setAsistenteSeleccionadoId] = useState(null);
  const [mostrarVerModal, setMostrarVerModal] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [asistentePagoId, setAsistentePagoId] = useState(null);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalAsistentes, setTotalAsistentes] = useState(0);
  const LIMITE_POR_PAGINA = 5;
  const [limitePorPagina, setLimitePorPagina] = useState(5);


  const obtenerAsistentesEvento = async () => {
    try {
      const data = await obtenerAsistentes({
        eventoId,
        nombre: busqueda,
        page: pagina,
        limit: limitePorPagina,
      });

      const { asistentes: lista, total, totalPages } = data;

      setTotalPaginas(totalPages);
      setTotalAsistentes(total);

      if (lista.length > 0) {
        const evento = lista[0].evento;
        setNombreEvento(evento?.nombre || "");

        const asistentesFormateados = lista.map((a) => {
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

  const confirmarEliminacion = (id) => {
    setIdAEliminar(id);
    const modal = new bootstrap.Modal(
      document.getElementById("modalConfirmacionEliminar")
    );
    modal.show();
  };

  const eliminarAsistenteConfirmado = async () => {
    try {
      await eliminarAsistente(idAEliminar, eventoId);
      toast.success("Asistente eliminado correctamente");
      obtenerAsistentesEvento(); // Refresca la tabla
      setIdAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar asistente:", error);
      toast.error("No se pudo eliminar el asistente");
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
}, [eventoId, pagina, busqueda, limitePorPagina]);


  return (
    <div className="fondo">
      <Navbar />
      <div className="container mt-4">
        <h4>ASISTENTES - Evento {nombreEvento}</h4>

        <div className="row mb-3">
  <div className="col-md-6">
    <label>Consulta por nombre:</label>
    <input
      type="text"
      className="form-control"
      value={busqueda}
      onChange={(e) => {
        setBusqueda(e.target.value);
        setPagina(1); // reiniciar paginación
      }}
    />
  </div>

  <div className="col-md-3">
    <label>Asistentes por página:</label>
    <select
      className="form-select"
      value={limitePorPagina}
      onChange={(e) => {
        setLimitePorPagina(parseInt(e.target.value));
        setPagina(1); // reinicia la página al cambiar el límite
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>
  </div>

  <div className="col-md-3 d-flex align-items-end justify-content-end">
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
                  <button
                    className="btn btn-success btn-sm me-1"
                    onClick={() => {
                      setAsistentePagoId(a.id);
                      setMostrarModalPago(true);
                    }}
                    disabled={a.estado === "Pagado"}
                    title={
                      a.estado === "Pagado"
                        ? "Este asistente ya pagó completamente"
                        : ""
                    }
                  >
                    Pago
                  </button>

                  <button
                    className="btn btn-danger btn-sm me-1"
                    onClick={() => confirmarEliminacion(a.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <nav className="d-flex justify-content-between align-items-center mt-3">
  <ul className="pagination mb-0">
    <li className={`page-item ${pagina === 1 ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => setPagina(1)}>
        Inicio
      </button>
    </li>
    <li className={`page-item ${pagina === 1 ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => setPagina(pagina - 1)}>
        Anterior
      </button>
    </li>

    {[...Array(totalPaginas)].map((_, i) => {
      const pageNumber = i + 1;
      return (
        <li
          key={pageNumber}
          className={`page-item ${pageNumber === pagina ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setPagina(pageNumber)}>
            {pageNumber}
          </button>
        </li>
      );
    }).slice(Math.max(pagina - 1, 0), pagina + 1)} {/* Solo muestra 2 páginas: actual y siguiente */}

    <li className={`page-item ${pagina === totalPaginas ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => setPagina(pagina + 1)}>
        Siguiente
      </button>
    </li>
    <li className={`page-item ${pagina === totalPaginas ? "disabled" : ""}`}>
      <button className="page-link" onClick={() => setPagina(totalPaginas)}>
        Fin
      </button>
    </li>
  </ul>

  <span className="ms-3">
    Página {pagina} de {totalPaginas} ({totalAsistentes} asistentes en total)
  </span>
</nav>


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

      <ModalConfirmacion
        titulo="Confirmar eliminación"
        mensaje="¿Estás seguro que deseas eliminar este asistente?"
        onConfirmar={eliminarAsistenteConfirmado}
        idModal="modalConfirmacionEliminar"
      />
      <ModalPagoAsistente
        eventoId={eventoId}
        asistenteId={asistentePagoId}
        show={mostrarModalPago}
        onClose={() => {
          setMostrarModalPago(false);
          setAsistentePagoId(null);
        }}
        onPagoRealizado={obtenerAsistentesEvento}
      />
    </div>
  );
};

export default VerAsistentes;
