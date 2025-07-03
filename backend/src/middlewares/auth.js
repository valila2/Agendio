// middlewares/verificarToken.js
import jwt from 'jsonwebtoken';
const SECRET_KEY = 'tu_clave_secreta';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ mensaje: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1]; // Extrae el token después de "Bearer"
  if (!token) return res.status(403).json({ mensaje: 'Token malformado' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded; // El payload del token
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};