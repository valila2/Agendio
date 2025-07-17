import React, { useState, useEffect } from "react";
import Navbar from "../components/shared/Navbar";
import ModalRegistrarTrabajador from "../components/trabajadores/ModalRegistrarTrabajador";
import ModalVerTrabajador from "../components/trabajadores/ModalVerTrabajador";
import * as bootstrap from "bootstrap";
import {
  obtenerTrabajadores,
  crearTrabajador,
  actualizarTrabajador,
  eliminarTrabajador,
} from "../services/trabajadorServices";
import { toast } from "react-toastify";
import ModalConfirmacion from "../components/shared/ModalConfirmacion";

function Trabajadores() {
  const [trabajadores, setTrabajadores] = useState([]);
  const [totalTrabajadores, setTotalTrabajadores] = useState(0);
  const [filtro, setFiltro] = useState("");
  const [cantidadMostrar, setCantidadMostrar] = useState(10);
  const [paginaActual, setPaginaActual] = useState(1);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
  const [modoFormulario, setModoFormulario] = useState("crear"); // "crear" o "editar"
  const [idEditando, setIdEditando] = useState(null);

  const [nuevoTrabajador, setNuevoTrabajador] = useState({
    nombre: "",
    rol: "trabajador",
    correo: "",
    contrasena: "",
  });
  const [idAEliminar, setIdAEliminar] = useState(null);

  useEffect(() => {
    cargarTrabajadores();
  }, [paginaActual, cantidadMostrar, filtro]);

  const cargarTrabajadores = async () => {
    try {
      const res = await obtenerTrabajadores({
        page: paginaActual,
        limit: cantidadMostrar,
        busqueda: filtro,
      });
      setTrabajadores(res.trabajadores);
      setTotalTrabajadores(res.total);
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
    }
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoTrabajador({ ...nuevoTrabajador, [name]: value });
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    try {
      if (modoFormulario === "crear") {
        await crearTrabajador(nuevoTrabajador);
        toast.success("Trabajador creado con exito");
      } else if (modoFormulario === "editar") {
        await actualizarTrabajador(idEditando, nuevoTrabajador);
        toast.success("Trabajador editado con exito");
      }

      setPaginaActual(1);
      cargarTrabajadores();

      // Resetear el formulario
      setNuevoTrabajador({
        nombre: "",
        rol: "trabajador",
        correo: "",
        contrasena: "",
      });
      setModoFormulario("crear");
      setIdEditando(null);

      // Cerrar el modal
      const modalInstance = bootstrap.Modal.getOrCreateInstance(
        document.getElementById("modalRegistrarTrabajador")
      );

      modalInstance.hide();
    } catch (error) {
      console.error("Error al guardar trabajador:", error);
    }
  };

  const manejarEliminar = (id) => {
    setIdAEliminar(id);
    const modalElement = document.getElementById("modalConfirmarEliminar");
    if (modalElement) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  };
  const confirmarEliminacion = async () => {
    try {
      await eliminarTrabajador(idAEliminar);
      toast.success("Trabajador eliminado");
      cargarTrabajadores();
      setIdAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar trabajador");
    }
  };

  const manejarVer = (t) => {
    setTrabajadorSeleccionado(t);
    const modalElement = document.getElementById("modalVerTrabajador");
    if (modalElement) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  };

  const manejarEditar = (t) => {
    setNuevoTrabajador({
      nombre: t.nombre,
      rol: t.rol,
      correo: t.correo,
      contrasena: "", // Puedes dejarlo vacío por seguridad
    });
    setModoFormulario("editar");
    setIdEditando(t._id);

    const modal = new bootstrap.Modal(
      document.getElementById("modalRegistrarTrabajador")
    );
    modal.show();
  };

  const totalPaginas = Math.ceil(totalTrabajadores / cantidadMostrar);
  const formatearFecha = (f) => new Date(f).toLocaleDateString("es-CO");

  return (
    <div className="fondo">
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-3">TRABAJADORES</h2>

        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <label className="form-label">Buscar (nombre o correo):</label>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar"
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>

          <div className="col-md-6 d-flex align-items-end justify-content-end">
            <label className="form-label me-2">Mostrar</label>
            <select
              className="form-select w-auto"
              value={cantidadMostrar}
              onChange={(e) => {
                setCantidadMostrar(Number(e.target.value));
                setPaginaActual(1);
              }}
            >
              {[5, 10, 20].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-flex align-items-end justify-content-end">
          <button
  className="btn btn-success mb-3"
  onClick={() => {
    setModoFormulario("crear");
    setNuevoTrabajador({
      nombre: "",
      rol: "trabajador",
      correo: "",
      contrasena: "",
    });
    setIdEditando(null);

    const modalElement = document.getElementById("modalRegistrarTrabajador");
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
  }}
>
  Registrar
</button>

        </div>

        <ModalRegistrarTrabajador
          nuevoTrabajador={nuevoTrabajador}
          manejarCambio={manejarCambio}
          manejarRegistro={manejarRegistro}
          modo={modoFormulario}
        />

        <ModalConfirmacion
          titulo="¿Eliminar trabajador?"
          mensaje="Esta acción no se puede deshacer. ¿Deseas continuar?"
          onConfirmar={confirmarEliminacion}
          idModal="modalConfirmarEliminar"
        />

        <table className="table table-striped">
          <thead className="table-primary">
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Correo</th>
              <th>Creado</th>
              <th>Actualizado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {trabajadores.map((t) => (
              <tr key={t._id}>
                <td>{t.nombre}</td>
                <td>{t.rol}</td>
                <td>{t.correo}</td>
                <td>{formatearFecha(t.createdAt)}</td>
                <td>{formatearFecha(t.updatedAt)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-1"
                    onClick={() => manejarVer(t)}
                  >
                    Ver
                  </button>
                  <button
                    className="btn btn-sm btn-warning me-1"
                    onClick={() => manejarEditar(t)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => manejarEliminar(t._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPaginas > 1 && (
          <div className="d-flex justify-content-between align-items-center">
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${paginaActual === 1 && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(1)}
                  >
                    Inicio
                  </button>
                </li>
                <li className={`page-item ${paginaActual === 1 && "disabled"}`}>
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(paginaActual - 1)}
                  >
                    Anterior
                  </button>
                </li>
                <li className="page-item active">
                  <span className="page-link">{paginaActual}</span>
                </li>
                <li
                  className={`page-item ${
                    paginaActual === totalPaginas && "disabled"
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(paginaActual + 1)}
                  >
                    Siguiente
                  </button>
                </li>
                <li
                  className={`page-item ${
                    paginaActual === totalPaginas && "disabled"
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(totalPaginas)}
                  >
                    Fin
                  </button>
                </li>
              </ul>
            </nav>
            <span>
              Página {paginaActual} de {totalPaginas} ({totalTrabajadores})
            </span>
          </div>
        )}
      </div>

      <ModalVerTrabajador trabajador={trabajadorSeleccionado} />
    </div>
  );
}

export default Trabajadores;
