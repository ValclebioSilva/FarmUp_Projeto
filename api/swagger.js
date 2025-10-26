// Este arquivo deve APENAS definir e exportar a configuração do Swagger.
// Ele NÃO deve criar um servidor Express nem chamar app.listen().

const swaggerJSDoc = require('swagger-jsdoc');

// Definição da URL do servidor
const serverUrl = process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:3000';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FarmaUP API - Gerenciamento de Clientes',
      version: '2.0.0',
      description: 'API REST para gerenciamento de clientes com PostgreSQL e Prisma. **Autenticação necessária**: Use o token de autenticação no header Authorization.',
    },
    servers: [
      {
        url: serverUrl,
        description: 'Servidor Local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Token',
          description: 'Token de autenticação da API (definido no .env como API_TOKEN)'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Clientes',
        description: 'Operações CRUD de clientes'
      },
      {
        name: 'Info',
        description: 'Informações da API'
      }
    ]
  },
  // O 'apis' aponta para os arquivos que contêm os comentários JSDoc (como no seu server.js e routes/clientes.js)
  apis: ['./server.js', './routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

// Exporta apenas a especificação
module.exports = swaggerSpec;