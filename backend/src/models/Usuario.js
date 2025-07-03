import { Schema, model } from 'mongoose';

// Definimos el esquema del modelo Usuario
const usuarioSchema = new Schema({
  nombre:        { type: String, required: true },
  correo:        { type: String, required: true, unique: true },
  contrasena:    { type: String, required: true },
  rol:           { type: String, enum: ['admin', 'trabajador'], required: true }
}, { timestamps: true });  // `timestamps` añade createdAt y updatedAt automáticamente

// Creamos y exportamos el modelo
export default model('Usuario', usuarioSchema);