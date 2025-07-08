import React from "react";

const ModalRegistrarTrabajador = ({
  nuevoTrabajador,
  manejarCambio,
  manejarRegistro,
}) => {
  return (
    <div
      className="modal fade"
      id="modalRegistrarTrabajador"
      tabIndex="-1"
      aria-labelledby="modalRegistrarTrabajadorLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <form className="modal-content" onSubmit={manejarRegistro}>
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="modalRegistrarTrabajadorLabel">
              Registrar Trabajador
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="nombre"
                  placeholder="Nombre"
                  value={nuevoTrabajador.nombre}
                  onChange={manejarCambio}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="rol"
                  placeholder="Rol"
                  value={nuevoTrabajador.rol}
                  onChange={manejarCambio}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  name="contacto"
                  placeholder="Contacto"
                  value={nuevoTrabajador.contacto}
                  onChange={manejarCambio}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control"
                  name="correo"
                  placeholder="Correo"
                  value={nuevoTrabajador.correo}
                  onChange={manejarCambio}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="password"
                  className="form-control"
                  name="contraseña"
                  placeholder="Contraseña"
                  value={nuevoTrabajador.contraseña}
                  onChange={manejarCambio}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">
              Registrar
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegistrarTrabajador;
