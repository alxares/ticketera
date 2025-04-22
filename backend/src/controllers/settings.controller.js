import prisma from "../config/database.js";
import { updateSettingsSchema } from "../schemas/settings.schema.js";

// Obtener configuración del usuario
export const getUserSettings = async (req, res) => {
  try {
    const { userId } = req.params;

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      return res.status(404).json({ message: "Configuraciones no encontradas." });
    }

    res.json(settings);
  } catch (error) {
    console.error("❌ Error al obtener configuraciones:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};

// Crear configuración inicial (opcional, normalmente en el registro)
export const createUserSettings = async (req, res) => {
  try {
    const { userId } = req.body;

    const settings = await prisma.userSettings.create({
      data: {
        userId,
      },
    });

    res.status(201).json(settings);
  } catch (error) {
    console.error("❌ Error al crear configuraciones:", error);
    res.status(500).json({ message: "No se pudo crear la configuración." });
  }
};

// Actualizar configuración del usuario
export const updateUserSettings = async (req, res) => {
  try {
    const data = updateSettingsSchema.parse(req.body);
    const { userId } = req.params;

    const updated = await prisma.userSettings.update({
      where: { userId },
      data,
    });

    res.json(updated);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Datos inválidos", errors: error.errors });
    }
    console.error("❌ Error al actualizar configuraciones:", error);
    res.status(500).json({ message: "Error al actualizar configuración." });
  }
};
