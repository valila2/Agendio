const ModalEvento = ({ form, handleChange, handleSubmit, editing, setEditing, setForm }) => {
  const limpiarFormulario = () => {
    setForm({ id: null, nombre: '', fecha: '', lugar: '', descripcion: '', valor: '' });
    setEditing(false);
  };

  return (
    <div className="modal fade" id="modalEvento" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title" id="modalLabel">{editing ? 'Editar Evento' : 'Nuevo Evento'}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" onClick={limpiarFormulario}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input name="nombre" type="text" className="form-control" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Fecha</label>
              <input name="fecha" type="date" className="form-control" value={form.fecha} onChange={handleChange} min={new Date().toISOString().split("T")[0]} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Lugar</label>
              <input name="lugar" type="text" className="form-control" value={form.lugar} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea name="descripcion" className="form-control" value={form.descripcion} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Valor</label>
              <input name="valor" type="number" className="form-control" value={form.valor} onChange={handleChange} required />
            </div>
          </div>
          <div className="modal-footer">
            
            <button type="submit" className="btn btn-primary">{editing ? 'Actualizar' : 'Crear'}</button>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={limpiarFormulario}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEvento;