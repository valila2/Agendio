import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRuta from './routes/auth.routes.js';
import usuarioRuta from "./routes/usuario.routes.js";
import eventoRuta from "./routes/evento.routes.js"
import trabajadoresRuta from "./routes/trabajador.routes.js"
const app = express();


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use("/api", usuarioRuta)
app.use("/api", eventoRuta)
app.use("/api", authRuta)
app.use("/api", trabajadoresRuta)
export default app;