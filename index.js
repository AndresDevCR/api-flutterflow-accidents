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
    const parsedData = await parseXmlToJson(data);
    res.json(parsedData);
  } catch (error) {
    console.error('Error al obtener datos de la API externa:', error);
    res.status(500).json({ error: 'Error al obtener datos de la API externa' });
  }
});

// Función para parsear XML a JSON de forma asincrónica
function parseXmlToJson(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        console.error('Error al convertir XML a JSON:', err);
        reject('Error interno del servidor');
      }
      
      if (!result || !result.markers || !result.markers.marker) {
        console.error('No se encontraron marcadores en la respuesta XML');
        reject('Error interno del servidor');
      }

      const markers = result.markers.marker.map(marker => {
        const renamedMarker = { ...marker };
        renamedMarker.data = renamedMarker['$'];
        delete renamedMarker['$'];
        renamedMarker.data.lat = parseFloat(renamedMarker.data.lat);
        renamedMarker.data.lng = parseFloat(renamedMarker.data.lng);
        return renamedMarker;
      });

      resolve(markers);
    });
  });
}

app.listen(PORT, () => {
  console.log(`Servidor Express funcionando en el puerto ${PORT}\n http://localhost:${PORT}`);
});
