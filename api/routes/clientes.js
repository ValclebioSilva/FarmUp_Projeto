const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Função auxiliar para validar email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Função auxiliar para validar telefone
const isValidPhone = (telefone) => /^\d{10,11}$/.test(telefone.replace(/\D/g, ''));

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nome:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           example: joao@email.com
 *         telefone:
 *           type: string
 *           example: 85988888888
 *         cidade:
 *           type: string
 *           example: Fortaleza
 *     ClienteInput:
 *       type: object
 *       required: [nome, email, telefone, cidade]
 *       properties:
 *         nome:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           example: joao@email.com
 *         telefone:
 *           type: string
 *           example: 85988888888
 *         cidade:
 *           type: string
 *           example: Fortaleza
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Lista todos os clientes
 *     description: Retorna uma lista de todos os clientes, com filtros opcionais por nome ou cidade.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome do cliente (parcial, case-insensitive)
 *       - in: query
 *         name: cidade
 *         schema:
 *           type: string
 *         description: Filtrar por cidade (parcial, case-insensitive)
 *     responses:
 *       '200':
 *         description: Lista de clientes obtida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 clientes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cliente'
 *       '500':
 *         description: Erro ao buscar clientes.
 */
router.get('/', async (req, res) => {
  try {
    const { cidade, nome } = req.query;
    const where = {};

    if (cidade) {
      where.cidade = { contains: cidade, mode: 'insensitive' };
    }
    if (nome) {
      where.nome = { contains: nome, mode: 'insensitive' };
    }

    const clientes = await prisma.cliente.findMany({
      where,
      orderBy: { id: 'asc' }
    });

    res.status(200).json({ total: clientes.length, clientes });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     tags:
 *       - Clientes
 *     summary: Buscar cliente por ID
 *     description: Retorna um único cliente baseado no ID fornecido.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico do cliente
 *     responses:
 *       '200':
 *         description: Cliente encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       '400':
 *         description: ID inválido.
 *       '404':
 *         description: Cliente não encontrado.
 *       '500':
 *         description: Erro ao buscar cliente.
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const cliente = await prisma.cliente.findUnique({ where: { id } });
    if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });

    res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
});

/**
 * @swagger
 * /clientes:
 *   post:
 *     tags:
 *       - Clientes
 *     summary: Criar novo cliente
 *     description: Cria um novo registro de cliente no banco de dados.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       '201':
 *         description: Cliente criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cliente criado com sucesso
 *                 cliente:
 *                   $ref: '#/components/schemas/Cliente'
 *       '400':
 *         description: Dados inválidos (campos obrigatórios, email ou telefone).
 *       '409':
 *         description: Email já cadastrado.
 *       '500':
 *         description: Erro ao criar cliente.
 */
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, cidade } = req.body;

    if (!nome || !email || !telefone || !cidade) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios',
        campos: ['nome', 'email', 'telefone', 'cidade']
      });
    }

    if (!isValidEmail(email)) return res.status(400).json({ error: 'Email inválido' });
    if (!isValidPhone(telefone)) return res.status(400).json({ error: 'Telefone inválido' });

    const emailExiste = await prisma.cliente.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (emailExiste) {
      return res.status(409).json({
        error: 'Email já cadastrado',
        clienteExistente: emailExiste.id
      });
    }

    const novoCliente = await prisma.cliente.create({
      data: {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        telefone: telefone.replace(/\D/g, ''),
        cidade: cidade.trim()
      }
    });

    res.status(201).json({
      message: 'Cliente criado com sucesso',
      cliente: novoCliente
    });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     tags:
 *       - Clientes
 *     summary: Atualizar cliente
 *     description: Atualiza os dados de um cliente existente baseado no ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       '200':
 *         description: Cliente atualizado com sucesso.
 *       '400':
 *         description: ID inválido ou dados inválidos.
 *       '404':
 *         description: Cliente não encontrado.
 *       '409':
 *         description: Email já cadastrado em outro cliente.
 *       '500':
 *         description: Erro ao atualizar cliente.
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const { nome, email, telefone, cidade } = req.body;

    if (!nome || !email || !telefone || !cidade) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios',
        campos: ['nome', 'email', 'telefone', 'cidade']
      });
    }

    if (!isValidEmail(email)) return res.status(400).json({ error: 'Email inválido' });
    if (!isValidPhone(telefone)) return res.status(400).json({ error: 'Telefone inválido' });

    const clienteExiste = await prisma.cliente.findUnique({ where: { id } });
    if (!clienteExiste) return res.status(404).json({ error: 'Cliente não encontrado' });

    const emailExiste = await prisma.cliente.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        NOT: { id }
      }
    });

    if (emailExiste) {
      return res.status(409).json({
        error: 'Email já cadastrado em outro cliente',
        clienteExistente: emailExiste.id
      });
    }

    const clienteAtualizado = await prisma.cliente.update({
      where: { id },
      data: {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        telefone: telefone.replace(/\D/g, ''),
        cidade: cidade.trim()
      }
    });

    res.status(200).json({
      message: 'Cliente atualizado com sucesso',
      cliente: clienteAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     tags:
 *       - Clientes
 *     summary: Excluir cliente
 *     description: Remove um cliente do banco de dados baseado no ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico do cliente
 *     responses:
 *       '200':
 *         description: Cliente excluído com sucesso.
 *       '400':
 *         description: ID inválido.
 *       '404':
 *         description: Cliente não encontrado.
 *       '500':
 *         description: Erro ao excluir cliente.
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

    const clienteExiste = await prisma.cliente.findUnique({ where: { id } });
    if (!clienteExiste) return res.status(404).json({ error: 'Cliente não encontrado' });

    const clienteRemovido = await prisma.cliente.delete({ where: { id } });

    res.status(200).json({
      message: 'Cliente excluído com sucesso',
      cliente: clienteRemovido
    });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
});

// Fechar conexão Prisma ao encerrar o processo
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = router;