const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta para obtener los datos en formato LatLng
app.get('/datos', async (req, res) => {
  try {
    const response = await axios.get('https://ariel-1.onrender.com/coordenadas');
    const datos = response.data.resultados;

    // Transformar los datos en formato LatLng
    const datosLatLng = transformarDatos(datos);

    res.json(datosLatLng);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ error: 'Hubo un error al obtener los datos' });
  }
});

// Función para transformar los datos en formato LatLng
function transformarDatos(datos) {
  return datos.map(item => {
    const coordenadas = item.coordenadas.split(',');
    return {
      latitud: parseFloat(coordenadas[0]),
      longitud: parseFloat(coordenadas[1])
    };
  });
}

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
