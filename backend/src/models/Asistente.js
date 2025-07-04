// models/Asistente.js
import { Schema, model } from 'mongoose';

const pagoSchema = new Schema({
  valor:       { type: Number, required: true },
  fecha:       { type: Date, default: Date.now },
  recibidoPor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const asistenteSchema = new Schema({
  nombre:        { type: String, required: true },
  telefono:      { type: String, required: true },
  evento:        { type: Schema.Types.ObjectId, ref: 'Evento', required: true },
  registradoPor: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  pagos:         { type: [pagoSchema], required: true }
}, {
  timestamps: true
});

export default model('Asistente', asistenteSchema);