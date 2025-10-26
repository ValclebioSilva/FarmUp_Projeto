# 🐘 API FarmaUP com PostgreSQL + Prisma

## 📦 Conteúdo desta Pasta

Esta pasta contém todos os arquivos necessários para migrar a API do FarmaUP de armazenamento em memória para PostgreSQL com Prisma.

## 📂 Estrutura

```
api-postgres/
├── docker-compose.yml     → Configuração do PostgreSQL
├── .env                   → Variáveis de ambiente
├── .gitignore            → Arquivos a ignorar
├── package.json          → Dependências (com Prisma)
├── server.js             → Servidor Express atualizado
├── routes/
│   └── clientes.js       → Rotas CRUD com Prisma
└── prisma/
    ├── schema.prisma     → Schema do banco de dados
    └── seed.js           → Dados iniciais
```

## 🚀 Como Usar

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

**Configure as variáveis no arquivo `.env`:**

```env
# Database
DATABASE_URL="postgresql://farmaup:farmaup123@localhost:5432/farmaup_clientes?schema=public"

# Server
PORT=3002
NODE_ENV=development

# Token de Autenticação API (OBRIGATÓRIO)
# IMPORTANTE: Use um token forte e único em produção
API_TOKEN=farmaup_2025_secure_token_12345
```

⚠️ **IMPORTANTE**: O `API_TOKEN` é obrigatório para autenticação. Todas as requisições à API devem incluir este token no header `Authorization: Bearer <token>`.

### 2. Instalar Docker

Baixe e instale: https://www.docker.com/products/docker-desktop

### 3. Seguir Guia de Instalação

## 🎯 Comandos Rápidos

```bash
# 1. Iniciar PostgreSQL
docker-compose up -d

# 2. Instalar dependências
cd api
npm install

# 3. Configurar Prisma
npx prisma generate
npx prisma migrate dev --name init

# 4. Popular banco
npm run prisma:seed

# 5. Iniciar API
npm start
```

## ✅ O que Muda

### Antes (Memória)
```javascript
let clientes = [
  { id: 1, nome: "Ana", ... }
];
```

### Agora (PostgreSQL)
```javascript
const clientes = await prisma.cliente.findMany();
```

## 🎁 Benefícios

✅ Dados persistentes  
✅ Banco profissional  
✅ Validações no banco  
✅ Prisma Studio (interface visual)  
✅ Migrations (versionamento)  
✅ Type-safe  
✅ **Autenticação por Bearer Token**  
✅ **Documentação Swagger com segurança integrada**  
✅ **Middleware de autenticação personalizado**  

## 🔐 Segurança

### Autenticação Bearer Token

A API implementa autenticação por Bearer Token em todos os endpoints de clientes.

#### Como Funciona

1. Configure o token no arquivo `.env`:
   ```env
   API_TOKEN=seu_token_seguro_aqui
   ```

2. Todas as requisições devem incluir o header:
   ```
   Authorization: Bearer seu_token_seguro_aqui
   ```

3. O middleware `middleware/auth.js` valida automaticamente todas as requisições.

#### Testando com cURL

```bash
# Requisição com autenticação
curl -H "Authorization: Bearer farmaup_2025_secure_token_12345" http://localhost:3002/clientes

# Requisição sem token (retorna erro 401)
curl http://localhost:3002/clientes
```

#### Swagger UI

1. Acesse: `http://localhost:3002/api-docs`
2. Clique no botão **"Authorize"** 🔓
3. Digite o token (sem o prefixo "Bearer")
4. Teste os endpoints diretamente pela interface

### Códigos de Status de Segurança

| Status | Descrição |
|--------|-----------|
| 401 | Token não fornecido ou formato inválido |
| 403 | Token inválido |

## 📖 Documentação

- Guia Completo de Migração: MIGRACAO_POSTGRESQL.md
- Documentação Prisma: https://www.prisma.io/docs
- PostgreSQL: https://www.postgresql.org/docs/

---

**Seu projeto agora usa banco de dados real! 🚀**
