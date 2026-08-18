const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((req, res) => {
  res.status(404).send('Error: Ruta no conocida');
});

// para hacer peticiones HTTP es app.[tipo de petición]
// entiendase laS tipos de peticiones GET, POST, PUT, DELETE, PATHC

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});