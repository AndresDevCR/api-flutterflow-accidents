const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { parseString } = require('xml2js');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const URL_API = process.env.URL_API;

app.use(bodyParser.json());

// Middleware para manejar errores
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Middleware para CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', async (req, res) => {
  try {
    const { data } = await axios.get(URL_API);
    parseString(data, (err, result) => {
      if (err) {
        console.error('Error al convertir XML a JSON:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      // Comprobar si existe la propiedad markers en el resultado
      if (!result.markers || !result.markers.marker) {
        console.error('No se encontraron marcadores en la respuesta XML');
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      const markers = result.markers.marker;

      // Función para convertir el formato de datos
      const convertirDatos = (markers, tipoColision) => {
        return markers.map(marker => ({
          id: marker.id,
          name: marker.name[0],
          hora: marker.hora[0],
          lat: parseFloat(marker.lat[0]),
          lng: parseFloat(marker.lng[0]),
          type: parseInt(marker.type[0]),
          hasta: marker.hasta[0],
          Nombre_Evento: marker.Nombre_Evento[0],
          tipoColision: tipoColision
        }));
      };

      const resultado = convertirDatos(markers, 'tipoColision');
      res.json(resultado);
    });
  } catch (error) {
    console.error('Error al obtener datos de la API externa:', error);
    res.status(500).json({ error: 'Error al obtener datos de la API externa' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Express funcionando en el puerto ${PORT}\n http://localhost:${PORT}`);
});
