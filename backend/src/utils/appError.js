export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Para diferenciar errores controlados de bugs del sistema

    Error.captureStackTrace(this, this.constructor);
  }
}