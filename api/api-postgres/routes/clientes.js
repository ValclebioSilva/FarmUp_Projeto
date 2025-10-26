const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Função auxiliar para validar email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Função auxiliar para validar telefone
const isValidPhone = (telefone) => {
  const phoneRegex = /^\d{10,11}$/;
  return phoneRegex.test(telefone.replace(/\D/g, ''));
};

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     description: Retorna lista de clientes com filtros opcionais por nome ou cidade
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtrar por nome (busca parcial, case-insensitive)
 *         example: ana
 *       - in: query
 *         name: cidade
 *         schema:
 *           type: string
 *         description: Filtrar por cidade (busca parcial, case-insensitive)
 *         example: fortaleza
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientesList'
 *       500:
 *         description: Erro ao buscar clientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (req, res) => {
  try {
    const { cidade, nome } = req.query;
    
    const where = {};
    
    if (cidade) {
      where.cidade = {
        contains: cidade,
        mode: 'insensitive'
      };
    }
    
    if (nome) {
      where.nome = {
        contains: nome,
        mode: 'insensitive'
      };
    }

    const clientes = await prisma.cliente.findMany({
      where,
      orderBy: {
        id: 'asc'
      }
    });

    res.status(200).json({
      total: clientes.length,
      clientes: clientes
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
});

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Busca cliente por ID
 *     description: Retorna os dados de um cliente específico
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Cliente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro ao buscar cliente
 */
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id }
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

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
 *     summary: Cria novo cliente
 *     description: Cadastra um novo cliente no sistema
 *     tags:
 *       - Clientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email já cadastrado
 *                 clienteExistente:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Erro ao criar cliente
 */
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, cidade } = req.body;

    // Validações
    if (!nome || !email || !telefone || !cidade) {
      return res.status(400).json({ 
        error: 'Todos os campos são obrigatórios',
        campos: ['nome', 'email', 'telefone', 'cidade']
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (!isValidPhone(telefone)) {
      return res.status(400).json({ error: 'Telefone inválido' });
    }

    // Verificar se email já existe
    const emailExiste = await prisma.cliente.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (emailExiste) {
      return res.status(409).json({ 
        error: 'Email já cadastrado',
        clienteExistente: emailExiste.id
      });
    }

    // Criar novo cliente
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
 *     summary: Atualiza cliente
 *     description: Atualiza os dados de um cliente existente
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 *       409:
 *         description: Email já cadastrado em outro cliente
 *       500:
 *         description: Erro ao atualizar cliente
 */
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { nome, email, telefone, cidade } = req.body;

    // Validações
    if (!nome || !email || !telefone || !cidade) {
      return res.status(400).json({ 
        error: 'Todos os campos são obrigatórios',
        campos: ['nome', 'email', 'telefone', 'cidade']
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (!isValidPhone(telefone)) {
      return res.status(400).json({ error: 'Telefone inválido' });
    }

    // Verificar se cliente existe
    const clienteExiste = await prisma.cliente.findUnique({
      where: { id }
    });

    if (!clienteExiste) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Verificar se email já existe em outro cliente
    const emailExiste = await prisma.cliente.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        NOT: {
          id: id
        }
      }
    });

    if (emailExiste) {
      return res.status(409).json({ 
        error: 'Email já cadastrado em outro cliente',
        clienteExistente: emailExiste.id
      });
    }

    // Atualizar cliente
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
 *     summary: Exclui cliente
 *     description: Remove um cliente do sistema
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Cliente não encontrado
 *       500:
 *         description: Erro ao excluir cliente
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    // Verificar se cliente existe
    const clienteExiste = await prisma.cliente.findUnique({
      where: { id }
    });

    if (!clienteExiste) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Excluir cliente
    const clienteRemovido = await prisma.cliente.delete({
      where: { id }
    });

    res.status(200).json({
      message: 'Cliente excluído com sucesso',
      cliente: clienteRemovido
    });
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    res.status(500).json({ error: 'Erro ao excluir cliente' });
  }
});

// Fechar conexão Prisma quando o processo terminar
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = router;