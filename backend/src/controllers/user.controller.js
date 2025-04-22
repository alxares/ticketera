import prisma from "../config/database.js";
import {
  createUserSchema,
  updateUserSchema
} from "../schemas/user.schema.js";

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            ticketsCreated: true,
            ticketsAssigned: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(users);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios." });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        department: true,
        ticketsCreated: true,
        ticketsAssigned: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al buscar usuario." });
  }
};

// Actualizar datos de usuario
export const updateUser = async (req, res) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const { id } = req.params;

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    res.json(updated);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    }
    console.error("❌ Error al actualizar usuario:", error);
    res.status(500).json({ message: "No se pudo actualizar el usuario." });
  }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    res.json({ message: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ message: "No se pudo eliminar el usuario." });
  }
};
