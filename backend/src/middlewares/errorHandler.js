import "dotenv/config";

export const errorHandler = (err, req, res, next) => {
     err.statusCode = err.statusCode || 500;
     err.status = err.status || 'error';

     // ERRORES MODELO

     // ERRORRE CONTROLADOR


     // Error en desarrollo
     if (process.env.NODE_ENV === 'development') {
          return res.status(err.statusCode).json({
               status: err.status,
               error: err,
               message: err.message,
               stack: err.stack,
          });
     }

     // Error en desarrollo producción
     if (err.isOperational) {
          // Errores controlados (ej: recurso no encontrado, validación fallida)
          return res.status(err.statusCode).json({
               status: err.status,
               message: err.message,
          });
     }

     // Errores de programación u otros desconocidos (no filtrar detalles técnicos)
     console.error('ERROR 💥:', err);
     return res.status(500).json({
          status: 'error',
          message: 'Algo salió muy mal en el servidor.',
     });
};