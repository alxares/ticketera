// scripts/create-it-department.js
import prisma from "../../src/config/database.js";

async function createITDepartment() {
  try {
    const existing = await prisma.department.findFirst({
      where: { name: "IT" },
    });

    if (existing) {
      console.log("⚠️ El departamento IT ya existe.");
      process.exit(0);
    }

    const dept = await prisma.department.create({
      data: {
        name: "IT",
      },
    });

    console.log("✅ Departamento IT creado:", dept);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al crear departamento IT:", error);
    process.exit(1);
  }
}

createITDepartment();
