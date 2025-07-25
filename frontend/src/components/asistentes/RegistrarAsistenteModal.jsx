import React, { useState } from "react";

const RegistrarAsistenteModal = ({ show, onClose, onSubmit, eventoId }) => {
  const [asistente, setAsistente] = useState({
    nombre: "",
    telefono: "",
    abono: 100000,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAsistente({ ...asistente, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(asistente, eventoId); // le mandas el asistente y el id del evento
    setAsistente({ nombre: "", telefono: "", abono: 100000 }); // limpiar
    onClose();
  };

  return (
    <>
      {show && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrar Asistente</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onClose}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={asistente.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      name="telefono"
                      value={asistente.telefono}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Abono inicial</label>
                    <input
                      type="number"
                      className="form-control"
                      name="abono"
                      value={asistente.abono}
                      onChange={handleChange}
                      required
                      min="100000"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrarAsistenteModal;
