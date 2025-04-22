import prisma from "../config/database.js";
import {
  createDepartmentSchema,
  updateDepartmentSchema
} from "../schemas/department.schema.js";

// Crear un nuevo departamento
export const createDepartment = async (req, res) => {
  try {
    const data = createDepartmentSchema.parse(req.body);

    const existing = await prisma.department.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      return res.status(400).json({ message: "El departamento ya existe." });
    }

    const department = await prisma.department.create({
      data: {
        name: data.name,
        managerId: data.managerId || null,
      },
    });

    res.status(201).json(department);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    }
    console.error("❌ Error al crear departamento:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Obtener todos los departamentos
export const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            tickets: true,
            users: true,
          },
        },
      },
    });

    res.json(departments);
  } catch (error) {
    console.error("❌ Error al obtener departamentos:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Actualizar un departamento
export const updateDepartment = async (req, res) => {
  try {
    const data = updateDepartmentSchema.parse(req.body);
    const { id } = req.params;

    const updated = await prisma.department.update({
      where: { id },
      data: {
        name: data.name,
        managerId: data.managerId || null,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    }
    console.error("❌ Error al actualizar departamento:", error);
    res.status(500).json({ message: "Error al actualizar el departamento." });
  }
};

// Eliminar un departamento
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.department.delete({
      where: { id },
    });

    res.json({ message: "Departamento eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar departamento:", error);
    res.status(500).json({ message: "Error al eliminar el departamento." });
  }
};
