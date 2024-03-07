const request = require('supertest');
const app = require('../index');

describe('GET /search/:fechaInicio/:fechaFin/:tipo', () => {
  it('responds with JSON containing the parsed data based on query parameters', async () => {
    const response = await request(app).get('/search/2022-01-01/2022-01-31/Colision');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
    expect(response.body).toEqual(expect.any(Object));

  });
});

