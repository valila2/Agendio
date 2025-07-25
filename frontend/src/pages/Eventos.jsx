import React, { useEffect, useState } from "react";
import ModalEvento from "../components/eventos/EventoModal";
import * as bootstrap from "bootstrap";
import { FaArrowLeft } from "react-icons/fa";

import {
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  obtenerEventosPorTrabajador,
} from "../services/eventosServices";
import Navbar from "../components/shared/Navbar";
import { toast } from "react-toastify";
import ModalVerEvento from "../components/eventos/ModalVerEvento";
import ModalAsignarTrabajador from "../components/eventos/ModalAsignarTrabajador";
import { useNavigate } from "react-router-dom";
import ModalConfirmacion from "../components/shared/ModalConfirmacion";
import {
  obtenerTrabajadores as fetchTrabajadores,
  asignarTrabajadorEvento,
} from "../services/trabajadorServices";

const Eventos = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [eventosPorPagina, setEventosPorPagina] = useState(5);
  const [totalEventos, setTotalEventos] = useState(0);
  const [fechaFiltro, setFechaFiltro] = useState("");

  const [form, setForm] = useState({
    id: null,
    nombre: "",
    fecha: "",
    lugar: "",
    descripcion: "",
    valor: "",
  });
  const [editing, setEditing] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [trabajadoresDisponibles, setTrabajadoresDisponibles] = useState([]);
  const [trabajadoresSeleccionados, setTrabajadoresSeleccionados] = useState(
    []
  );
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [eventoParaVer, setEventoParaVer] = useState(null);
  const [eventoParaAsignar, setEventoParaAsignar] = useState(null);

  const getUsuarioLogueado = () => {
    const storedUser = localStorage.getItem("usuario");
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const usuario = getUsuarioLogueado();

  const obtenerTrabajadores = async () => {
    try {
      const res = await fetchTrabajadores({ page: 1, limit: 1000 });
      setTrabajadoresDisponibles(res.trabajadores || []);
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
    }
  };

  const abrirModalAsignar = (evento) => {
    setEventoParaAsignar(evento);
    setTrabajadoresSeleccionados(evento.trabajadores?.map((t) => t._id) || []);
    obtenerTrabajadores();

    const modal = new bootstrap.Modal(
      document.getElementById("modalAsignarTrabajador")
    );
    modal.show();
  };

  const handleSeleccionTrabajador = (e) => {
    const id = e.target.value;
    if (e.target.checked) {
      setTrabajadoresSeleccionados((prev) => [...prev, id]);
    } else {
      setTrabajadoresSeleccionados((prev) => prev.filter((t) => t !== id));
    }
  };

  const handleAsignarTrabajadores = async () => {
    try {
      if (trabajadoresSeleccionados.length === 0) {
        toast.warning("Debes seleccionar al menos un trabajador");
        return;
      }

      await asignarTrabajadorEvento(
        eventoParaAsignar._id,
        trabajadoresSeleccionados
      );

      toast.success("Trabajadores asignados correctamente");
      cargarEventos();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalAsignarTrabajador")
      );
      modal.hide();
    } catch (error) {
      console.error("Error al asignar trabajadores:", error);
      toast.error("Ocurrió un error al asignar");
    }
  };

  const cargarEventos = async (pagina = 1) => {
    try {
      const usuario = getUsuarioLogueado();

      let data;

      if (usuario.rol === "admin") {
        data = await obtenerEventos(pagina, eventosPorPagina, fechaFiltro);
      } else if (usuario.rol === "trabajador") {
        data = await obtenerEventosPorTrabajador(
          usuario.id,
          pagina,
          eventosPorPagina,
          fechaFiltro
        );
      }

      const eventosFormateados = data.eventos.map((ev) => ({
        ...ev,
        id: ev._id,
      }));

      setEventos(eventosFormateados);
      setTotalPaginas(data.totalPages);
      setTotalEventos(data.totalEventos);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };

  useEffect(() => {
    cargarEventos(paginaActual);
  }, [eventosPorPagina, paginaActual, fechaFiltro]);

  const handleCambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await actualizarEvento(form.id, form);
      } else {
        await crearEvento(form);
      }
      toast.success("Evento creado con exito");
      setForm({
        id: null,
        nombre: "",
        fecha: "",
        lugar: "",
        descripcion: "",
        valor: "",
      });
      setEditing(false);
      cargarEventos();
      console.log("form:", form);
      const cerrarModalYLimpiar = (modalId) => {
        const modalElement = document.getElementById(modalId);
        if (!modalElement) return;

        const modalInstance =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement);
        modalInstance.hide();
      };

      cerrarModalYLimpiar("modalEvento");
    } catch (error) {
      console.error("Error al guardar el evento:", error);
    }
  };

  const handleEdit = (evento) => {
    const fechaFormateada = new Date(evento.fecha).toISOString().split("T")[0];
    setForm({ ...evento, fecha: fechaFormateada });
    setEditing(true);
    const modal = new bootstrap.Modal(document.getElementById("modalEvento"));
    modal.show();
  };

  const confirmarEliminacion = (id) => {
    setIdAEliminar(id);
    const modal = new bootstrap.Modal(
      document.getElementById("modalConfirmacionEliminar")
    );
    modal.show();
  };

  const eliminarEventoConfirmado = async () => {
    try {
      await eliminarEvento(idAEliminar);
      toast.success("Evento eliminado correctamente");
      cargarEventos();
      setIdAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      toast.error("No se pudo eliminar el evento");
    }
  };

  const handleView = (evento) => {
    // Forzar re-render aunque sea el mismo evento
    setEventoParaVer(null);
    setTimeout(() => {
      setEventoParaVer(evento);
    }, 0);
  };

  useEffect(() => {
    if (eventoParaVer) {
      const modalElement = document.getElementById("modalVerEvento");
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement, {
          backdrop: "static",
        });
        modal.show();
      }
    }
  }, [eventoParaVer]);

  const formatearFecha = (fecha) => {
    const [anio, mes, dia] = fecha.split("T")[0].split("-");
    const fechaLegible = new Date(`${anio}-${mes}-${dia}T00:00:00`);
    return fechaLegible.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="fondo">
      <Navbar />
      <div className="container mt-4">
        <h2>LISTA DE EVENTOS</h2>

        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <label className="form-label">Filtrar por fecha:</label>
            <input
              type="date"
              className="form-control"
              value={fechaFiltro}
              onChange={(e) => {
                setFechaFiltro(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>
          <div className="col-md-6 d-flex align-items-end justify-content-end">
            <div>
              <label className="form-label me-2">Mostrar:</label>
              <select
                className="form-select w-auto"
                value={eventosPorPagina}
                onChange={(e) => {
                  setEventosPorPagina(Number(e.target.value));
                  setPaginaActual(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
              </select>
            </div>
          </div>
        </div>
        {usuario.rol == "admin" && (
          <div className=" d-flex align-items-end justify-content-end">
            <button
              className="btn btn-success mb-3"
              onClick={() => {
                setForm({
                  id: null,
                  nombre: "",
                  fecha: "",
                  lugar: "",
                  descripcion: "",
                  valor: "",
                });
                setEditing(false);

                const modal = new bootstrap.Modal(
                  document.getElementById("modalEvento")
                );
                modal.show();
              }}
            >
              Crear Evento
            </button>
          </div>
        )}

        {eventos.length === 0 ? (
          <p>No hay eventos registrados.</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Lugar</th>
                <th>Valor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((ev) => (
                <tr key={ev.id}>
                  <td>{ev.nombre}</td>
                  <td>{formatearFecha(ev.fecha)}</td>
                  <td>{ev.lugar}</td>
                  <td>
                    {ev.valor.toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                    })}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleView(ev)}
                    >
                      Ver
                    </button>
                    {usuario.rol === "admin" && (
                      <>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(ev)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-secondary me-2"
                          onClick={() => abrirModalAsignar(ev)}
                        >
                          Trabajador(es)
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => confirmarEliminacion(ev.id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal para Crear/Editar */}
        <ModalEvento
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editing={editing}
          setEditing={setEditing}
          setForm={setForm}
        />
        <ModalVerEvento
          eventoSeleccionado={eventoParaVer}
          formatearFecha={formatearFecha}
        />

        <ModalAsignarTrabajador
          eventoSeleccionado={eventoParaAsignar}
          trabajadoresDisponibles={trabajadoresDisponibles}
          trabajadoresSeleccionados={trabajadoresSeleccionados}
          handleSeleccionTrabajador={handleSeleccionTrabajador}
          handleAsignarTrabajadores={handleAsignarTrabajadores}
        />

        <ModalConfirmacion
          titulo="Confirmar eliminación"
          mensaje="¿Estás seguro de que deseas eliminar este evento?"
          onConfirmar={eliminarEventoConfirmado}
          idModal="modalConfirmacionEliminar"
        />

        {totalPaginas > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <nav>
              <ul className="pagination mb-0">
                <li
                  className={`page-item ${
                    paginaActual === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => cargarEventos(1)}
                  >
                    Inicio
                  </button>
                </li>

                <li
                  className={`page-item ${
                    paginaActual === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handleCambiarPagina(paginaActual - 1)}
                  >
                    Anterior
                  </button>
                </li>

                {paginaActual > 1 && (
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handleCambiarPagina(paginaActual - 1)}
                    >
                      {paginaActual - 1}
                    </button>
                  </li>
                )}

                <li className="page-item active">
                  <span className="page-link">{paginaActual}</span>
                </li>

                {paginaActual < totalPaginas && (
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handleCambiarPagina(paginaActual + 1)}
                    >
                      {paginaActual + 1}
                    </button>
                  </li>
                )}

                <li
                  className={`page-item ${
                    paginaActual === totalPaginas ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handleCambiarPagina(paginaActual + 1)}
                  >
                    Siguiente
                  </button>
                </li>

                <li
                  className={`page-item ${
                    paginaActual === totalPaginas ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => cargarEventos(totalPaginas)}
                  >
                    Fin
                  </button>
                </li>
              </ul>
            </nav>

            <p className="mb-0 text-muted">
              Página {paginaActual} de {totalPaginas} ({totalEventos} eventos en
              total)
            </p>
          </div>
        )}
      </div>
      <div className="container mt-4">
        <button
          className="btn btn-link text-decoration-none"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="fs-1" />
        </button>
      </div>
    </div>
  );
};
export default Eventos;
