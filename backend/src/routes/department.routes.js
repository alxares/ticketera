import express from "express";
import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment
} from "../controllers/department.controller.js";

import verifyToken from "../middleware/auth.js";
import authorizeRoles from "../middleware/role.js";
import prisma from "../config/database.js";

const router = express.Router();

/**
 * 🟢 Ruta pública: usada para el formulario de registro
 * Devuelve todos los departamentos EXCEPTO el de IT
 * No requiere autenticación
 */
router.get("/public", async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: {
        NOT: { name: "IT" }
      },
      select: {
        id: true,
        name: true
      },
      orderBy: { name: "asc" }
    });

    res.json(departments);
  } catch (error) {
    console.error("❌ Error al obtener departamentos públicos:", error);
    res.status(500).json({ message: "Error al obtener departamentos." });
  }
});

/**
 * 🛡️ Rutas protegidas (requieren autenticación y rol ADMIN)
 */

// Obtener todos los departamentos
router.get("/", verifyToken, authorizeRoles("ADMIN"), getDepartments);

// Crear un nuevo departamento
router.post("/", verifyToken, authorizeRoles("ADMIN"), createDepartment);

// Actualizar un departamento
router.put("/:id", verifyToken, authorizeRoles("ADMIN"), updateDepartment);

// Eliminar un departamento
router.delete("/:id", verifyToken, authorizeRoles("ADMIN"), deleteDepartment);

export default router;
