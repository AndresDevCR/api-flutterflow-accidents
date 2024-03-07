# Ruta Alterna API

This is a project developed by Codingraph, in collaboration with Ruta Alterna Org, in which the application aims to enhance the lives of its users when searching for an alternative route due to any unforeseen circumstances.

## Run Locally

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Testing

To run tests, run the following command

```bash
  npm run test
```

```bash
  npm run test:coverage
```

```bash
  npm run test:watch
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`URL_API`

## Tech Stack

**Server:** Node, Express, Swagger UI, Jest, Supertest, Axios, Cors, Dotenv, Nodemon.

## API Reference

#### Swagger API documentarion

Local Server
```
  http://localhost:3011/api-docs/#/
```

Production Server

```
https://api-flutterflow-accidents.onrender.com/api-docs/
```

#### Endpoints

```http
  GET http://localhost:3011/search/{fechaInicio}/{fechaFin}/{tipo}
```

| Parameter      | Type     | Description                                |
| :------------- | :------- | :----------------------------------------- |
| `fechaInicio ` | `string` | **Required**. fechaInicio of item to fetch |
| `fechaFin `    | `string` | **Required**. fechaFin of item to fetch    |
| `tipo `        | `string` | **Required**. tipo of item to fetch        |

## Authors

- [@AndresDevCR](https://github.com/AndresDevCR)
