import cors from 'cors'

// @REVISAR: se corrigio el cors - el host venia con comillas ("http://localhost:8080") desde el .env,
// lo que hacia que el origin NUNCA coincidiera y CORS bloqueara todas las peticiones del frontend.
// Ahora se limpia el string (quita comillas) y acepta una lista de origenes separados por coma.
export const corsMiddleware = (hostAceptado) => {
  const origenes = (hostAceptado || '')
    .replace(/["']/g, '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  return cors({
    origin: (origin, callback) => {
      // Permite requests sin origin (curl, postman, etc.) o si el origin esta en la lista
      if (!origin || origenes.length === 0 || origenes.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origen no permitido por CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
};
