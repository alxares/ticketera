// scripts/create-admin.js
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import prisma from "../src/config/database.js";

dotenv.config();

async function createAdmin() {
  try {
    // Verificar si ya existe el usuario admin
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: "admin@prueba.com" }, { username: "admin" }],
      },
    });

    if (existing) {
      console.log("⚠️ El usuario administrador ya existe.");
      process.exit(0);
    }

    // Buscar el departamento IT
    const itDept = await prisma.department.findFirst({
      where: { name: "IT" },
    });

    if (!itDept) {
      console.error("❌ No se encontró el departamento IT. Crealo primero.");
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash("admin12345", 10);

    const admin = await prisma.user.create({
      data: {
        fullName: "Administrador",
        username: "admin",
        email: "admin@prueba.com",
        password: hashedPassword,
        role: "ADMIN",
        departmentId: itDept.id,
      },
    });

    console.log("✅ Administrador creado:", admin);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al crear admin:", error);
    process.exit(1);
  }
}

createAdmin();
