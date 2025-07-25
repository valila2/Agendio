import React, { useEffect, useState } from "react";
import { obtenerAsistentePorEventoYId } from "../../services/asistenteServices";

const VerAsistenteModal = ({ eventoId, asistenteId, show, onClose }) => {
  const [asistente, setAsistente] = useState(null);

  useEffect(() => {
    if (show && eventoId && asistenteId) {
      const fetchData = async () => {
        try {
          const data = await obtenerAsistentePorEventoYId(
            eventoId,
            asistenteId
          );
          setAsistente(data);
        } catch (error) {
          console.error("Error al cargar asistente:", error);
        }
      };
      fetchData();
    }
  }, [show, eventoId, asistenteId]);

  if (!show) return null;
  const totalAbonos =
    asistente?.pagos?.reduce((total, pago) => total + pago.valor, 0) || 0;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          {/* Título */}
          <div className="modal-header bg-primary text-white py-2">
            <h5 className="modal-title">Detalle del asistente</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Cuerpo del modal */}
          <div className="modal-body">
            {asistente ? (
              <>
                <div className="row">
                  <div className="col-6">
                    <p>
                      <strong>Evento:</strong>{" "}
                      {asistente.evento?.nombre || "xxxx"}
                    </p>
                    <p>
                      <strong>Nombre:</strong> {asistente.nombre}
                    </p>
                    <p>
                      <strong>FechaCreación:</strong>{" "}
                      {new Date(asistente.createdAt).toLocaleString("es-CO")}

                    </p>
                    <p>
                      <strong>Valor:</strong> $
                      {asistente.evento.valor?.toLocaleString("es-CO") ||
                        "xxxx"}
                    </p>
                  </div>

                  <div className="col-6">
                    <p>
                      <strong>Total abonado:</strong> $
                      {totalAbonos.toLocaleString("es-CO")}
                    </p>
                    <p>
                      <strong>Saldo:</strong> $
                      {(
                        (asistente.evento.valor || 0) -
                        (asistente.pagos?.reduce(
                          (total, p) => total + p.valor,
                          0
                        ) || 0)
                      ).toLocaleString("es-CO")}
                    </p>
                    <p>
                      <strong>Trabajador:</strong>{" "}
                      {asistente.registradoPor?.nombre || "xxxx"}
                    </p>
                  </div>
                </div>

                {/* Tabla de historial de pagos */}
                <h6 className="mt-4">Historial de pagos</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead className="table-light">
                      <tr>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                        <th>Recibido por</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asistente.pagos?.length > 0 ? (
                        asistente.pagos.map((pago, index) => (
                          <tr key={index}>
                            <td>${pago.valor?.toLocaleString("es-CO")}</td>
                            <td>
                              {new Date(pago.fecha).toLocaleString("es-CO")}
                            </td>
                            <td>
                              {pago.recibidoPor?.nombre || "No registrado"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No hay pagos registrados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p>Cargando...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerAsistenteModal;
