import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';

import verifyToken from '../middleware/auth.js';
import authorizeRoles from '../middleware/role.js';
import prisma from '../config/database.js'; // ✅ Importar prisma directamente

const router = express.Router();

// ✅ Obtener todos los usuarios (solo ADMIN)
router.get('/', verifyToken, authorizeRoles('ADMIN'), getAllUsers);

// ✅ Obtener usuario por ID
router.get('/:id', verifyToken, authorizeRoles('ADMIN'), getUserById);

// ✅ Actualizar usuario
router.put('/:id', verifyToken, authorizeRoles('ADMIN'), updateUser);

// ✅ Eliminar usuario
router.delete('/:id', verifyToken, authorizeRoles('ADMIN'), deleteUser);

// ✅ Obtener usuarios por departamento (para asignación dinámica)
router.get('/department/:departmentId', verifyToken, async (req, res) => {
  try {
    const { departmentId } = req.params;

    const users = await prisma.user.findMany({
      where: {
        departmentId,
        role: {
          in: ['USER', 'MANAGER'],
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error('❌ Error al obtener usuarios por departamento:', error);
    res.status(500).json({ message: 'No se pudo obtener la lista de usuarios.' });
  }
});

export default router;
