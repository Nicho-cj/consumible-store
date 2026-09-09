// @REVISAR: Se agrego el parametro 'next' a la firma (requerido por Express para reconocer error middleware)
export const errorHandler = (err, req, res, next) => {

  // @REVISAR: Se corrigieron los codigos HTTP en los errores de BD:
  //   23505 (violacion de unicidad) -> 409 Conflict, no 404
  //   23503 (violacion de FK) -> 409 Conflict, no 404
  //   23502 (NOT NULL violado) -> 400 Bad Request, no 404
  //   42P01 (tabla no existe) -> 500, no 404
  //   42703 (columna desconocida) -> 400 Bad Request, no 404

  switch (err.code) {
    case 'ECONNREFUSED':
      return res.status(500).json({
        status: 'error',
        message: 'Base de Datos: Sin conexion a base de datos',
      });

    case '23505':
      return res.status(409).json({
        status: 'error',
        message: 'Base de Datos: Duplicidad de valor en columna unica',
      });

    case '23503':
      return res.status(409).json({
        status: 'error',
        message: 'Base de Datos: Violacion de llave foranea',
      });

    case '23502':
      return res.status(400).json({
        status: 'error',
        message: 'Base de Datos: Violacion de restriccion de nulo',
      });

    case '42P01':
      return res.status(500).json({
        status: 'error',
        message: 'Base de Datos: La tabla no existe',
      });

    case '42703':
      return res.status(400).json({
        status: 'error',
        message: 'Base de Datos: Columna desconocida',
      });
  }

  // @REVISAR: En produccion, reemplazar console.log por un sistema de logging (p.ej. pino o winston)
  // Solo loggear en entorno de desarrollo
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return res.status(500).json({
    status: 'error',
    message: 'Algo salio muy mal en el servidor o error no mapeado.',
  });
};
