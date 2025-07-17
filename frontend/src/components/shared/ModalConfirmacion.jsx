import React from "react";

const ModalConfirmacion = ({ titulo, mensaje, onConfirmar, idModal }) => {
  return (
    <div className="modal fade" id={idModal} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">{titulo}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <p>{mensaje}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirmar}
              data-bs-dismiss="modal"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;
