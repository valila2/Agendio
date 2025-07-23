import React, { useEffect, useState } from "react";
import {
  obtenerAsistentePorEventoYId,
  registrarPagoAsistente,
} from "../../services/asistenteServices";
import { toast } from "react-toastify";

const ModalPagoAsistente = ({
  eventoId,
  asistenteId,
  show,
  onClose,
  onPagoRealizado,
}) => {
  const [asistente, setAsistente] = useState(null);
  const [valorPago, setValorPago] = useState("");

  useEffect(() => {
    const fetchAsistente = async () => {
      try {
        if (eventoId && asistenteId && show) {
          const data = await obtenerAsistentePorEventoYId(
            eventoId,
            asistenteId
          );
          setAsistente(data);
        }
      } catch (error) {
        toast.error("Error al cargar información del asistente.");
      }
    };
    fetchAsistente();
  }, [eventoId, asistenteId, show]);

  const handleRegistrarPago = async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const userId = usuario?.id || usuario?._id;

    const pago = Number(valorPago);

    if (pago > saldo) {
      toast.warning("El valor ingresado excede el saldo pendiente.");
      return;
    }

    if (pago <= 0) {
      toast.warning("Ingresa un valor válido mayor a cero.");
      return;
    }

    try {
      await registrarPagoAsistente(eventoId, asistenteId, {
        valor: pago,
        recibidoPor: userId,
      });
      toast.success("Pago registrado con éxito");
      onPagoRealizado();
      onClose();
    } catch (error) {
      toast.error("Error al registrar el pago");
    }
  };

  if (!show || !asistente) return null;

  const totalPagado =
    asistente.pagos?.reduce((acc, pago) => acc + pago.valor, 0) || 0;
  const saldo = (asistente.evento?.valor || 0) - totalPagado;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          {/* Encabezado */}
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Registrar Pago</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Cuerpo */}
          <div className="modal-body">
            <p>
              <strong>Evento:</strong> {asistente.evento?.nombre}
            </p>
            <p>
              <strong>Saldo actual:</strong> ${saldo.toLocaleString("es-CO")}
            </p>

            <div className="form-group">
              <label>Valor a pagar:</label>
              <input
                type="number"
                className="form-control"
                value={valorPago}
                onChange={(e) => setValorPago(e.target.value)}
              />
            </div>
          </div>

          {/* Pie */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={handleRegistrarPago}>
              Registrar pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPagoAsistente;
