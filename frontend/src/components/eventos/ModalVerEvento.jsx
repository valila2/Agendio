import React from "react";
import { useNavigate } from "react-router-dom";

const ModalVerEvento = ({ eventoSeleccionado, formatearFecha }) => {
  const navigate = useNavigate();

  if (!eventoSeleccionado) return null;

  return (
    <div
      className="modal fade"
      id="modalVerEvento"
      tabIndex="-1"
      aria-labelledby="modalVerEventoLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="modalVerEventoLabel">
              Detalles del Evento
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <p>
              <strong>Nombre:</strong> {eventoSeleccionado.nombre}
            </p>
            <p>
              <strong>Fecha inicio evento:</strong> {formatearFecha(eventoSeleccionado.fecha)}
            </p>
            <p>
              <strong>Lugar:</strong> {eventoSeleccionado.lugar}
            </p>
            <p>
              <strong>Descripción:</strong> {eventoSeleccionado.descripcion}
            </p>
            <p>
              <strong>Valor:</strong>{" "}
              {eventoSeleccionado.valor.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}
            </p>
            <p>
              <strong>Fecha creacion:</strong> {formatearFecha(eventoSeleccionado.createdAt)}
            </p>
            <div className="mt-3">
              <h6 className="fw-bold">Trabajadores asignados:</h6>
              {eventoSeleccionado.trabajadores.length === 0 ? (
                <p className="text-muted">No hay trabajadores asignados.</p>
              ) : (
                <ul>
                  {eventoSeleccionado.trabajadores.map((t) => (
                    <li key={t._id}>{t.nombre}</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 d-flex justify-content-between">
              <button
                className="btn btn-dark"
                onClick={() => {
                  document
                    .getElementById("modalVerEvento")
                    .classList.remove("show");
                  document.body.classList.remove("modal-open");
                  document.querySelector(".modal-backdrop")?.remove();
                  navigate(`/ver-asistentes/${eventoSeleccionado.id}`);
                }}
              >
                Ver asistentes
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerEvento;
