import React from "react";

const ModalVerTrabajador = ({ trabajador }) => {
  if (!trabajador) return null;

  return (
    <div
      className="modal fade"
      id="modalVerTrabajador"
      tabIndex="-1"
      aria-labelledby="modalVerTrabajadorLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="modalVerTrabajadorLabel">
              Detalles del Trabajador
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <p><strong>Nombre:</strong> {trabajador.nombre}</p>
            <p><strong>Correo:</strong> {trabajador.correo}</p>
            <p><strong>Rol:</strong> {trabajador.rol}</p>
            <p><strong>Creado:</strong> {new Date(trabajador.createdAt).toLocaleDateString("es-CO")}</p>
            <p><strong>Actualizado:</strong> {new Date(trabajador.updatedAt).toLocaleDateString("es-CO")}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerTrabajador;
