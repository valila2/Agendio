// src/controllers/asistente.controller.js
import Asistente from "../models/Asistente.js";

// Crear un nuevo asistente
export const crearAsistente = async (req, res) => {
  const { nombre, telefono, evento, registradoPor, pagos } = req.body;

  if (!nombre || !telefono || !evento || !registradoPor) {
    return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
  }

  if (!pagos || !Array.isArray(pagos) || pagos.length === 0) {
    return res
      .status(400)
      .json({ mensaje: "El registro requiere al menos un abono" });
  }

  if (pagos[0].valor < 100000) {
    return res
      .status(400)
      .json({ mensaje: "El abono inicial debe ser mínimo de 100.000" });
  }
  try {
    const nuevoAsistente = new Asistente({
      nombre,
      telefono,
      evento,
      registradoPor,
      pagos,
    });
    await nuevoAsistente.save();
    res.status(201).json(nuevoAsistente);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el asistente", error });
  }
};



// export const obtenerAsistentes = async (req, res) => {
//   try {
//     const { eventoId, nombre, page = 1, limit = 10 } = req.query;

//     const filtro = {};

//     if (eventoId) {
//       filtro.evento = eventoId;
//     }

//     if (nombre) {
//       filtro.nombre = { $regex: nombre, $options: "i" };
//     }

//     //} Convertimos page y limit a números
//     const pageNumber = parseInt(page);
//     const limitNumber = parseInt(limit);

//     const asistentes = await Asistente.find(filtro)
//       .sort({ createdAt: -1 })
//       .skip((pageNumber - 1) * limitNumber)
//       .limit(limitNumber)
//       .populate({
//         path: "evento",
//         select: "nombre lugar fecha valor descripcion",
//       })
//       .populate({
//         path: "registradoPor",
//         select: "nombre correo",
//       })
//       .populate({
//         path: "pagos.recibidoPor",
//         select: "nombre correo",
//       });

//     const total = await Asistente.countDocuments(filtro);

//     res.json({
//       total,
//       page: pageNumber,
//       totalPages: Math.ceil(total / limitNumber),
//       asistentes,
//     });
//   } catch (error) {
//     console.error("Error al obtener asistentes:", error);
//     res.status(500).json({ mensaje: "Error al obtener los asistentes", error });
//   }
// };




// Eliminar un asistente por id y id evento
export const obtenerAsistentes = async (req, res) => {
  try {
    const { eventoId, nombre, page = 1, limit = 10 } = req.query;

    const filtro = {};

    if (eventoId) {
      filtro.evento = eventoId;
    }

    if (nombre) {
      filtro.nombre = { $regex: nombre, $options: "i" };
    }

    //} Convertimos page y limit a números
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const asistentes = await Asistente.find(filtro)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .populate({
        path: "evento",
        select: "nombre lugar fecha valor descripcion",
      })
      .populate({
        path: "registradoPor",
        select: "nombre correo",
      })
      .populate({
        path: "pagos.recibidoPor",
        select: "nombre correo",
      });

    const total = await Asistente.countDocuments(filtro);

    res.json({
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      asistentes,
    });
  } catch (error) {
    console.error("Error al obtener asistentes:", error);
    res.status(500).json({ mensaje: "Error al obtener los asistentes", error });
  }
};


export const eliminarAsistenteDeEvento = async (req, res) => {
  try {
    const { asistenteId, eventoId } = req.query;

    if (!asistenteId || !eventoId) {
      return res.status(400).json({ mensaje: "Faltan parámetros: asistenteId o eventoId" });
    }

    // Validar que el asistente pertenece al evento
    const asistente = await Asistente.findOne({ _id: asistenteId, evento: eventoId });

    if (!asistente) {
      return res.status(404).json({ mensaje: "No se encontró un asistente con ese ID para el evento especificado" });
    }

    // Eliminar al asistente
    await Asistente.findByIdAndDelete(asistenteId);

    res.json({ mensaje: "Asistente eliminado correctamente del evento" });
  } catch (error) {
    console.error("Error al eliminar asistente:", error);
    res.status(500).json({ mensaje: "Error al eliminar asistente", error });
  }
};

export const registrarPagoAsistente = async (req, res) => {
  try {
    const { asistenteId, eventoId } = req.params;
    const { valor, recibidoPor } = req.body;

    if (!valor || !recibidoPor) {
      return res
        .status(400)
        .json({ mensaje: "Faltan datos del pago: valor o recibidoPor" });
    }

    // Verifica que el asistente existe y pertenece al evento
    const asistente = await Asistente.findOne({ _id: asistenteId, evento: eventoId });

    if (!asistente) {
      return res.status(404).json({ mensaje: "Asistente no encontrado para ese evento" });
    }

    // Agrega el nuevo pago
    asistente.pagos.push({ valor, recibidoPor });
    await asistente.save();

    res.status(200).json({ mensaje: "Pago registrado correctamente", asistente });
  } catch (error) {
    console.error("Error al registrar pago:", error);
    res.status(500).json({ mensaje: "Error al registrar el pago", error });
  }
};



export const obtenerAsistentePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const asistente = await Asistente.findById(id)
      .populate({
        path: "evento",
        select: "nombre lugar fecha valor descripcion",
      })
      .populate({
        path: "registradoPor",
        select: "nombre correo",
      })
      .populate({
        path: "pagos.recibidoPor",
        select: "nombre correo",
      });

    if (!asistente) {
      return res.status(404).json({ mensaje: "Asistente no encontrado" });
    }

    res.json(asistente);
  } catch (error) {
    console.error("Error al obtener asistente por ID:", error);
    res.status(500).json({ mensaje: "Error al obtener asistente", error });
  }
};

export const obtenerAsistentePorEventoYId = async (req, res) => {
  try {
    const { eventoId, asistenteId } = req.query;

    if (!eventoId || !asistenteId) {
      return res.status(400).json({ mensaje: "Faltan parámetros eventoId o asistenteId" });
    }

    const asistente = await Asistente.findOne({
      _id: asistenteId,
      evento: eventoId
    })
      .populate({
        path: "evento",
        select: "nombre lugar fecha valor descripcion",
      })
      .populate({
        path: "registradoPor",
        select: "nombre correo",
      })
      .populate({
        path: "pagos.recibidoPor",
        select: "nombre correo",
      });

    if (!asistente) {
      return res.status(404).json({ mensaje: "Asistente no encontrado con ese ID y evento" });
    }

    // 🔽 Ordenar pagos por fecha descendente
    asistente.pagos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    res.json(asistente);
  } catch (error) {
    console.error("Error al obtener el asistente:", error);
    res.status(500).json({ mensaje: "Error al obtener asistente", error });
  }
};


