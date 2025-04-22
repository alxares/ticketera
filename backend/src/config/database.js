import { PrismaClient } from '@prisma/client';

// Crear una única instancia de PrismaClient
const prisma = new PrismaClient();

// Manejo de eventos de error global (opcional pero recomendado)
prisma.$on('beforeExit', async () => {
  console.log('🔌 Prisma se está desconectando...');
  await prisma.$disconnect();
});

// Exportación por default para importación más limpia
export default prisma;