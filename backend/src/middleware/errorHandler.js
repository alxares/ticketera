/**
 * Middleware centralizado para manejar errores de forma limpia
 */
const errorHandler = (err, req, res, next) => {
  console.error('🛑 Error capturado:', err.stack);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Ocurrió un error inesperado en el servidor',
    // Solo en desarrollo: mostrar detalles
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default errorHandler;
