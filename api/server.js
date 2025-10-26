require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const clientesRoutes = require('./routes/clientes');
const authenticate = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'FarmaUP API Docs'
}));

// Rota para retornar JSON do Swagger
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Rotas
app.use('/clientes', authenticate, clientesRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Informações da API
 *     description: Retorna informações básicas sobre a API
 *     tags:
 *       - Info
 *     responses:
 *       200:
 *         description: Informações da API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: API FarmaUP - Gerenciamento de Clientes com PostgreSQL
 *                 version:
 *                   type: string
 *                   example: 2.0.0
 *                 database:
 *                   type: string
 *                   example: PostgreSQL + Prisma
 *                 docs:
 *                   type: string
 *                   example: http://localhost:3000/api-docs
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'API FarmaUP - Gerenciamento de Clientes com PostgreSQL',
    version: '2.0.0',
    database: 'PostgreSQL + Prisma',
    docs: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      'GET /clientes': 'Lista todos os clientes',
      'GET /clientes/:id': 'Busca cliente por ID',
      'POST /clientes': 'Cria novo cliente',
      'PUT /clientes/:id': 'Atualiza cliente',
      'DELETE /clientes/:id': 'Exclui cliente'
    }
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);  
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
  console.log(`🐘 Banco de dados: PostgreSQL`);
});

module.exports = app;