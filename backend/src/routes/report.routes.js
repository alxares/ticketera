import express from 'express';
import {
  getTicketStats,
  getDepartmentStats
} from '../controllers/report.controller.js';

import verifyToken from '../middleware/auth.js';
import authorizeRoles from '../middleware/role.js';

const router = express.Router();

// Reporte general de tickets
router.get('/tickets', verifyToken, authorizeRoles('ADMIN', 'MANAGER'), getTicketStats);

// Reporte de departamentos
router.get('/departments', verifyToken, authorizeRoles('ADMIN', 'MANAGER'), getDepartmentStats);

export default router;
