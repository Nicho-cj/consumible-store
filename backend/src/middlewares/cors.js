import cors from 'cors'

export const corsMiddleware = (hostAceptado) => cors(
  {origin: hostAceptado})