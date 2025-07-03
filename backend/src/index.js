import app from './app.js';
import { connectDB } from './database.js';
import config from './config.js';

const main = async () => {
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${config.PORT}`);
  });
};

main();