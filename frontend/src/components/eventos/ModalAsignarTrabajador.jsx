import React from "react";

const ModalAsignarTrabajador = ({
  eventoSeleccionado,
  trabajadoresDisponibles,
  trabajadoresSeleccionados,
  handleSeleccionTrabajador,
  handleAsignarTrabajadores,
}) => {
  return (
    <div
      className="modal fade"
      id="modalAsignarTrabajador"
      tabIndex="-1"
      aria-labelledby="modalAsignarTrabajadorLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="modalAsignarTrabajadorLabel">
              Asignar Trabajadores al Evento
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
              <strong>Evento:</strong> {eventoSeleccionado?.nombre}
            </p>

            <div className="form-group">
              <label className="form-label mb-2">
                Selecciona trabajadores (máx. 2)
              </label>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  padding: "10px",
                }}
              >
                {trabajadoresDisponibles.map((trabajador) => (
                  <div className="form-check" key={trabajador._id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={trabajador._id}
                      id={`trabajador-${trabajador._id}`}
                      onChange={handleSeleccionTrabajador}
                      checked={trabajadoresSeleccionados.includes(
                        trabajador._id
                      )}
                      disabled={
                        !trabajadoresSeleccionados.includes(trabajador._id) &&
                        trabajadoresSeleccionados.length >= 2
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`trabajador-${trabajador._id}`}
                    >
                      {trabajador.nombre}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              onClick={handleAsignarTrabajadores}
            >
              Asignar
            </button>
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAsignarTrabajador;
