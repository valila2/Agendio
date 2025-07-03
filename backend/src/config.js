import dotenv from "dotenv";
dotenv.config();
const { PORT, MONGODB_URI, MONGODB_HOST, MONGO_DATABASE } = process.env;
// Función que determina la URI de conexión
const getMongoURI = () => {
  // Si MONGODB_URI está definida, es para Atlas
  if (MONGODB_URI) {
    return MONGODB_URI;
  }
  // Si no, usamos la configuración local
  return `mongodb://${MONGODB_HOST}:27017/${MONGO_DATABASE}`;
};

export default { PORT: PORT || 4000, MONGO_URI: getMongoURI() };