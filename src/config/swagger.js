const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Centralizada de Documentos',
      version: '1.0.0',
      description: 'Documentação da API para o projeto de ingestão e consulta de documentos.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos com as anotações
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
}; 