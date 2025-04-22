import express from 'express';
import { sendMessage, getMessages } from '../controllers/chat.controller.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Enviar un nuevo mensaje
router.post('/send', verifyToken, sendMessage);

// Obtener historial entre dos usuarios
router.get('/messages/:user1/:user2', verifyToken, getMessages);

export default router;
// En este archivo se definen las rutas relacionadas con el chat.