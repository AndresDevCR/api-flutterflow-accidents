const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { parseString } = require('xml2js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para analizar cuerpos de solicitud entrantes
app.use(bodyParser.json());

// Middleware para permitir solicitudes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Ruta para convertir el formato de datos y devolver la información
app.get('/', async (req, res) => {
  // Obtener datos XML de la API externa
  try {
    const { data } = await axios.get(process.env.URL_API);
    // Convertir XML a JSON
    parseString(data, (err, result) => {
      if (err) {
        console.error('Error al convertir XML a JSON:', err);
        res.status(500).send('Error interno del servidor');
        return;
      }

      const markers = result.markers.marker;

      // Función para convertir el formato de datos
      const convertirDatos = (markers, tipoColision) => {
        return markers.map(marker => {
          return {
            id: marker.id,
            name: marker.name[0],
            hora: marker.hora[0],
            lat: parseFloat(marker.lat[0]),
            lng: parseFloat(marker.lng[0]),
            type: parseInt(marker.type[0]),
            hasta: marker.hasta[0],
            Nombre_Evento: marker.Nombre_Evento[0],
            tipoColision: tipoColision
          };
        });
      };

      const resultado = convertirDatos(markers, 'tipoColision');
      res.json(resultado);
    });
  } catch (error) {
    console.error('Error al obtener datos de la API externa:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express funcionando en el puerto ${PORT}\n http://localhost:${PORT}`);
});
