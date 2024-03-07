const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { parseString } = require('xml2js');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const URL_API = process.env.URL_API;

// Swagger options
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Ruta Alterna API Documentation',
      version: '1.0.0',
      description: 'Documentation for your API',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
      {
        url: 'https://api-flutterflow-accidents.onrender.com',
        description: 'Production server',
      }
    ],
  },
  apis: ['./index.js'], // Path to the API routes file
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

/**
 * @swagger
 * /search/{fechaInicio}/{fechaFin}/{tipo}:
 *   get:
 *     description: Endpoint para buscar datos por fechaInicio, fechaFin y tipo
 *     parameters:
 *       - name: fechaInicio
 *         in: path
 *         description: Fecha de inicio de la búsqueda
 *         required: true
 *         schema:
 *           type: string
 *       - name: fechaFin
 *         in: path
 *         description: Fecha de fin de la búsqueda
 *         required: true
 *         schema:
 *           type: string
 *       - name: tipo
 *         in: path
 *         description: Tipo de búsqueda
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/search/:fechaInicio/:fechaFin/:tipo', async (req, res) => {
  try {
    const { data } = await axios.get(`${URL_API}/recursos/dataparam.php?fechaInicio=${req.params.fechaInicio}&fechaFin=${req.params.fechaFin}&tipo=${req.params.tipo}`);
    const parsedData = await parseXmlToJson(data);
    res.json(parsedData);
  } catch (error) {
    console.error('Error al obtener datos de la API externa:', error);
    res.status(500).json({ error: 'Error al obtener datos de la API externa' });
  }
});

// Función para parsear XML a JSON de forma asincrónica
async function parseXmlToJson(xmlData) {
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
        return renamedMarker;
      });

      resolve(markers);
    });
  });
}

module.exports = app;

app.listen(PORT, () => {
  console.log(`Servidor Express funcionando en el puerto ${PORT}\n http://localhost:${PORT}`);
});
