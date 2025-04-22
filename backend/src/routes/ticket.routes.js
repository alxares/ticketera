import express from 'express';
import multer from 'multer';
import {
  createTicket,
  getAllTickets,
  getTicketsByUser,
  getTicketById,
  updateTicket,
  deleteTicket
} from '../controllers/ticket.controller.js';

import verifyToken from '../middleware/auth.js';
import authorizeRoles from '../middleware/role.js';

const router = express.Router();

// 🧩 Configuración de almacenamiento para archivos con Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Asegúrate de que la carpeta 'uploads' exista
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// 🎛️ Configuración de Multer
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Límite de 10MB por archivo
  },
});

// ✅ Ruta para crear un ticket con archivos (soporta hasta 5 adjuntos)
router.post(
  '/',
  verifyToken,                      // 🛡️ Requiere token JWT válido
  upload.array("files", 5),        // 📎 Soporta hasta 5 archivos por ticket
  createTicket                     // 🧾 Controlador para crear ticket
);

// ✅ Ruta para listar todos los tickets (solo para ADMIN y MANAGER)
router.get(
  '/',
  verifyToken,
  authorizeRoles('ADMIN', 'MANAGER'),
  getAllTickets
);

// ✅ Ruta para obtener tickets creados por un usuario específico
router.get(
  '/user/:userId',
  verifyToken,
  getTicketsByUser
);

// ✅ Ruta para obtener un ticket por su ID
router.get(
  '/:id',
  verifyToken,
  getTicketById
);

// ✅ Ruta para actualizar un ticket (solo ADMIN y MANAGER)
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN', 'MANAGER'),
  updateTicket
);

// ✅ Ruta para eliminar un ticket (solo ADMIN)
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  deleteTicket
);

export default router;
