import prisma from "../config/database.js";

// Obtener estadísticas generales de los tickets
export const getTicketStats = async (req, res) => {
  try {
    const total = await prisma.ticket.count();

    const byStatus = await prisma.ticket.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const byPriority = await prisma.ticket.groupBy({
      by: ['priority'],
      _count: { priority: true },
    });

    res.json({
      totalTickets: total,
      ticketsByStatus: byStatus,
      ticketsByPriority: byPriority,
    });
  } catch (error) {
    console.error("❌ Error al generar reporte de tickets:", error);
    res.status(500).json({ message: "Error al generar el reporte." });
  }
};

// Obtener estadísticas por departamento
export const getDepartmentStats = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { tickets: true, users: true },
        },
      },
    });

    const stats = departments.map(dep => ({
      name: dep.name,
      tickets: dep._count.tickets,
      users: dep._count.users,
    }));

    res.json(stats);
  } catch (error) {
    console.error("❌ Error al generar reporte de departamentos:", error);
    res.status(500).json({ message: "Error al generar el reporte." });
  }
};
