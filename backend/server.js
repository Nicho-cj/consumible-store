import { app } from './app.js'
import { setupRealtime } from './src/utils/realtime.js'

const PORT = process.env.BACK_PORT

// Creamos el servidor HTTP utilizando la app de Express
const server = app.listen(PORT, () => {
  console.log(`Backend funcionando ( http://localhost:${PORT} )`)
})

// Inicializamos WebSockets
setupRealtime(server)