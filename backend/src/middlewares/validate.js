export const validate = (schema) => (req, res, next) => {
     const result = schema.safeParse(req.body);
     if (!result.success) {
          const formattedErrors = Object.fromEntries(
               result.error.issues.map((issue) => [issue.path[0], issue.message])
          );

          return res.status(400).json({
               status: 'error de validación',
               errors: formattedErrors,
          });
     }
     req.body = result.data;
     next();
};

export const validatePartial = (schema) => (req, res, next) => {
     const result = schema.partial().safeParse(req.body);
     if (!result.success) {
          const formattedErrors = Object.fromEntries(
               result.error.issues.map((issue) => [issue.path[0], issue.message])
          );
          console.log(formattedErrors);

          return res.status(400).json({
               status: 'error',
               message: 'Error de validación parcial',
               errors: formattedErrors,
          });
     }
     req.body = result.data;
     next();
};