export const errorHandler = (err, req, res, next) => {
     console.log(typeof err);
     console.error(err);

     //   ERRORES : Base de Datos
     switch (err.code) {
          case 'ECONNREFUSED':
               return res.status(500).json({
                    status: 'error',
                    message: 'Base de Datos: Sin conexión a base de datos',
               })

          case '23505':
               return res.status(404).json({
                    status: 'error',
                    message: 'Base de Datos: Duplicidad de valor en columna única',
               })

          case '23503':
               return res.status(404).json({
                    status: 'error',
                    message: 'Base de Datos: Violación de llave foránea',
               })

          case '23502':
               return res.status(404).json({
                    status: 'error',
                    message: 'Base de Datos: Violación de restricción de nulo',
               })

          case '42P01':
               return res.status(404).json({
                    status: 'error',
                    message: 'Base de Datos: La tabla no existe',
               })
     }



     return res.status(500).json({
          status: 'error',
          message: 'Algo salió muy mal en el servidor o error no mapeado.',
     });
};