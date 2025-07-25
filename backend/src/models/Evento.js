// models/evento.js

import { Schema, model } from 'mongoose';

// Definimos el esquema para los eventos
const eventoSchema = new Schema({
  nombre:        { type: String, required: true },
  lugar:         { type: String, required: true },
  fecha:         { type: Date, required: true },
  valor:         { type: Number, required: true },
  descripcion:   { type: String, requires: true},
  trabajadores:  [{ type: Schema.Types.ObjectId, ref: 'Usuario' }]
}, { timestamps: true });  // `timestamps` añade createdAt y updatedAt automáticamente

// Creamos y exportamos el modelo
export default model('Evento', eventoSchema);