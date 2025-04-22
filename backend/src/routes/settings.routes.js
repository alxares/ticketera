import express from 'express';
import {
  getUserSettings,
  createUserSettings,
  updateUserSettings
} from '../controllers/settings.controller.js';

import verifyToken from '../middleware/auth.js';

const router = express.Router();

// Obtener configuración del usuario
router.get('/:userId', verifyToken, getUserSettings);

// Crear configuración inicial
router.post('/', verifyToken, createUserSettings);

// Actualizar configuración del usuario
router.put('/:userId', verifyToken, updateUserSettings);

export default router;
