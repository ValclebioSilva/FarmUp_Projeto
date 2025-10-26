# 🏥 FarmaUP - Sistema de Gerenciamento de Clientes

Projeto completo desenvolvido para o Teste Técnico de Estagiário de Desenvolvimento da FarmaUP, contendo uma API REST em Node.js e o webem Flutter.

## 📋 Sobre o Projeto

Sistema CRUD completo para gerenciamento de clientes, permitindo:
- Cadastrar novos clientes
- Listar todos os clientes
- Buscar clientes por nome ou cidade
- Atualizar informações de clientes
- Excluir clientes

## 🏗️ Estrutura do Projeto

```
farmaup-teste/
├── api/                    # Backend - API REST em Node.js
│   ├── server.js          # Servidor Express
│   ├── routes/
│   │   └── clientes.js    # Rotas do CRUD
│   ├── package.json
│   └── README.md
│
└── frontend/              # Frontend - Aplicativo Flutter
    ├── lib/
    │   ├── main.dart
    │   ├── models/
    │   ├── services/
    │   └── screens/
    ├── pubspec.yaml
    └── README.md
```

## 🚀 Tecnologias Utilizadas

### Backend (API)
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **CORS** - Habilitar requisições cross-origin
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM para Node.js
- **Swagger** - Documentação interativa da API
- **Bearer Token Authentication** - Segurança da API

### Frontend (Mobile)
- **Flutter** - Framework mobile
- **Dart** - Linguagem de programação
- **HTTP** - Cliente para requisições HTTP

## ⚙️ Instalação e Execução

### 1️⃣ Clonar o Repositório

```bash
git clone [URL-DO-REPOSITORIO]
cd farmaup-teste
```

### 2️⃣ Configurar e Executar a API

```bash
cd api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copie o arquivo .env.example para .env e configure o token de autenticação
cp .env.example .env

# Edite o arquivo .env e defina um token seguro em API_TOKEN
# Exemplo: API_TOKEN=farmaup_2025_secure_token_12345

# Executar migrations do Prisma
npm run prisma:migrate

# (Opcional) Popular banco com dados de exemplo
npm run prisma:seed

# Iniciar servidor
npm start
```

A API estará rodando em: `http://localhost:3002`

**🔒 Importante**: A API agora requer autenticação por token. Todas as requisições devem incluir o header:
```
Authorization: Bearer seu-token-aqui
```

### 3️⃣ Configurar e Executar o Frontend

```bash
cd frontend
flutter pub get

# Configurar URL da API e TOKEN no arquivo lib/services/api_service.dart
# 1. Ajuste a baseUrl conforme seu ambiente:
#    - Emulador Android: http://10.0.2.2:3002
#    - Dispositivo físico: http://SEU_IP:3002
#    - Web: http://localhost:3002
# 
# 2. Configure o apiToken com o mesmo valor definido no .env da API
#    Exemplo: static const String apiToken = 'farmaup_2025_secure_token_12345';

flutter run
```

**🔒 Importante**: O token no frontend deve ser o mesmo configurado no arquivo `.env` da API (variável `API_TOKEN`).

## 🔐 Configuração de Segurança

### Token de Autenticação

A API utiliza autenticação por Bearer Token para proteger todos os endpoints. Siga os passos abaixo para configurar:

#### 1. Configurar Token na API

No arquivo `api/.env`, defina um token seguro:

```env
API_TOKEN=farmaup_2025_secure_token_12345
```

**⚠️ IMPORTANTE**: 
- Use um token forte e único em produção
- Nunca compartilhe o token publicamente
- Não commit o arquivo `.env` no Git
- Use o arquivo `.env.example` como referência

#### 2. Configurar Token no Frontend

No arquivo `frontend/lib/services/api_service.dart`, configure o mesmo token:

```dart
static const String apiToken = 'farmaup_2025_secure_token_12345';
```

#### 3. Formato da Requisição

Todas as requisições HTTP devem incluir o header de autenticação:

```
Authorization: Bearer farmaup_2025_secure_token_12345
```

### Como a Autenticação Funciona

1. **Cliente faz requisição** → Envia token no header `Authorization`
2. **Middleware valida** → Verifica se o token existe e está no formato correto
3. **Comparação** → Compara o token recebido com o `API_TOKEN` do `.env`
4. **Resultado**:
   - ✅ Token válido → Requisição processada normalmente
   - ❌ Token inválido/ausente → Retorna erro 401 ou 403

### Códigos de Status de Segurança

| Status | Significado | Quando ocorre |
|--------|-------------|---------------|
| 401 Unauthorized | Token não fornecido ou formato inválido | Header `Authorization` ausente ou mal formatado |
| 403 Forbidden | Token inválido | Token fornecido não corresponde ao `API_TOKEN` |

### Testando a Segurança

```bash
# ❌ Requisição sem token (retorna 401)
curl http://localhost:3002/clientes

# ❌ Token com formato errado (retorna 401)
curl -H "Authorization: meu_token" http://localhost:3002/clientes

# ❌ Token inválido (retorna 403)
curl -H "Authorization: Bearer token_errado" http://localhost:3002/clientes

# ✅ Token válido (retorna 200 e os dados)
curl -H "Authorization: Bearer farmaup_2025_secure_token_12345" http://localhost:3002/clientes
```

### Swagger UI com Autenticação

O Swagger UI está configurado para usar a autenticação Bearer Token:

1. Acesse `http://localhost:3002/api-docs`
2. Clique no botão **"Authorize"** 🔓 (cadeado no topo direito)
3. No campo **"Value"**, digite apenas o token (sem "Bearer")
4. Clique em **"Authorize"** e depois **"Close"**
5. O cadeado ficará fechado 🔒 indicando autenticação ativa
6. Todas as requisições pelo Swagger incluirão automaticamente o token

## 📱 Funcionalidades Implementadas

### ✅ Parte 1 - API (Obrigatória)

- [x] GET /clientes - Lista todos os clientes
- [x] GET /clientes/:id - Busca cliente específico
- [x] POST /clientes - Cria novo cliente
- [x] PUT /clientes/:id - Atualiza cliente
- [x] DELETE /clientes/:id - Exclui cliente
- [x] PostgreSQL + Prisma como ORM
- [x] IDs numéricos gerados automaticamente
- [x] Respostas JSON com status HTTP adequados
- [x] Código organizado (server.js e routes/clientes.js)
- [x] Documentação Swagger interativa
- [x] **Autenticação por Bearer Token**

### ✅ Parte 2 - Interface (Obrigatória)

- [x] Listar todos os clientes (GET /clientes)
- [x] Cadastrar novos clientes (POST /clientes)
- [x] Excluir clientes (DELETE /clientes/:id)
- [x] Interface intuitiva e responsiva
- [x] Feedback visual (loading, erros, sucesso)

### ⭐ Funcionalidades Bônus

- [x] Validação de email duplicado (erro 409 Conflict)
- [x] Filtro por cidade via query param (GET /clientes?cidade=Fortaleza)
- [x] Busca por nome parcial (GET /clientes?nome=ana)
- [x] Validação de email e telefone
- [x] Editar clientes (PUT /clientes/:id)
- [x] Confirmação antes de excluir
- [x] Pull to refresh no mobile
- [x] **Autenticação Bearer Token em todas as rotas**
- [x] **Documentação Swagger com autenticação configurada**
- [x] **Middleware de segurança personalizado**

## 🎯 Critérios de Avaliação Atendidos

| Critério | Status |
|----------|--------|
| Funcionamento do CRUD | ✅ Completo |
| Clareza e organização do código | ✅ Código limpo e bem estruturado |
| Entendimento de API e HTTP | ✅ Status codes corretos e RESTful |
| Interface | ✅ Flutter com UX moderna |
| Respostas conceituais | ✅ Documentação completa |

## 📊 Endpoints da API

| Método | Rota | Descrição | Status | Auth |
|--------|------|-----------|--------|------|
| GET | /clientes | Lista clientes (com filtros opcionais) | 200 | ✅ |
| GET | /clientes/:id | Busca cliente por ID | 200, 404 | ✅ |
| POST | /clientes | Cria novo cliente | 201, 400, 409 | ✅ |
| PUT | /clientes/:id | Atualiza cliente | 200, 400, 404, 409 | ✅ |
| DELETE | /clientes/:id | Exclui cliente | 200, 404 | ✅ |

**🔒 Autenticação**: Todos os endpoints requerem o header `Authorization: Bearer <token>`

### Respostas de Autenticação

| Status | Descrição |
|--------|-----------|
| 401 | Token não fornecido ou formato inválido |
| 403 | Token inválido |

### Exemplo de Cliente

```json
{
  "id": 1,
  "nome": "Ana Souza",
  "email": "ana@email.com",
  "telefone": "85999999999",
  "cidade": "Fortaleza"
}
```

## 🧪 Testando a API

### Usando cURL

**Importante**: Substitua `SEU_TOKEN_AQUI` pelo token configurado no arquivo `.env` (variável `API_TOKEN`)

```bash
# Definir o token (substitua pelo seu token)
$TOKEN = "farmaup_2025_secure_token_12345"

# Listar todos
curl -H "Authorization: Bearer $TOKEN" http://localhost:3002/clientes

# Criar cliente
curl -X POST http://localhost:3002/clientes `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d '{\"nome\":\"João Silva\",\"email\":\"joao@email.com\",\"telefone\":\"85988888888\",\"cidade\":\"Fortaleza\"}'

# Buscar por ID
curl -H "Authorization: Bearer $TOKEN" http://localhost:3002/clientes/1

# Filtrar por cidade
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3002/clientes?cidade=Fortaleza"

# Buscar por nome
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3002/clientes?nome=ana"

# Atualizar
curl -X PUT http://localhost:3002/clientes/1 `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d '{\"nome\":\"João Silva Santos\",\"email\":\"joao@email.com\",\"telefone\":\"85988888888\",\"cidade\":\"Fortaleza\"}'

# Excluir
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:3002/clientes/1
```

### Testando sem Token (deve retornar erro 401)

```bash
# Tentativa sem token
curl http://localhost:3002/clientes
# Resposta esperada: {"error": "Token de autenticação não fornecido", ...}

# Tentativa com token inválido
curl -H "Authorization: Bearer token_invalido" http://localhost:3002/clientes
# Resposta esperada: {"error": "Token de autenticação inválido", ...}
```

### Usando Swagger UI

1. Acesse: `http://localhost:3002/api-docs`
2. Clique no botão **"Authorize"** (cadeado verde no topo)
3. Digite o token configurado no `.env` (sem o prefixo "Bearer")
4. Clique em **"Authorize"** e depois **"Close"**
5. Agora você pode testar todos os endpoints através da interface Swagger

## 🎨 Screenshots do Aplicativo

### Tela Principal
- Lista de clientes com cards
- Campo de busca com filtros
- Botão flutuante para adicionar

### Tela de Formulário
- Campos validados
- Feedback visual
- Botões de ação

## 🔒 Validações

### Backend (API)
- Email válido e único
- Telefone com 10-11 dígitos
- Campos obrigatórios
- Status HTTP apropriados
- **Autenticação por Bearer Token obrigatória**
- **Validação de formato do token (Bearer \<token\>)**

### Frontend (Flutter)
- Email formato válido
- Telefone apenas números
- Nome mínimo 3 caracteres
- Cidade mínimo 3 caracteres
- Feedback visual em tempo real
- **Token de autenticação enviado em todas as requisições**

## 📝 Notas Técnicas

### Armazenamento
- PostgreSQL como banco de dados
- Prisma como ORM
- IDs autoincrementais
- Migrations versionadas

### Segurança
- **Autenticação por Bearer Token**
- **Token configurável via variável de ambiente (.env)**
- **Middleware de autenticação personalizado**
- **Proteção em todos os endpoints de clientes**
- **Documentação Swagger com autenticação integrada**

### CORS
- Habilitado para todas as origens
- Necessário para comunicação com Flutter

### Organização
- Separação de responsabilidades
- Código comentado e documentado
- RESTful API design
- Clean Code principles

## 🚧 Possíveis Melhorias Futuras

- [ ] JWT (JSON Web Tokens) para autenticação com expiração
- [ ] Sistema de usuários com login/logout
- [ ] Rate limiting para prevenir abuso
- [ ] Logs de auditoria de acesso
- [ ] Paginação de resultados
- [ ] Testes automatizados (Jest, Flutter test)
- [ ] Docker para facilitar deploy
- [ ] CI/CD pipeline
- [ ] Logs estruturados
- [ ] Upload de foto do cliente
- [ ] Histórico de alterações
- [ ] Criptografia de dados sensíveis

## 🐛 Troubleshooting

### API não inicia
- Verifique se o Node.js está instalado
- Execute `npm install` novamente
- Verifique se a porta 3000 está disponível

### Flutter não conecta na API
- Verifique a URL em `api_service.dart`
- Use `10.0.2.2:3000` para emulador Android
- Use seu IP local para dispositivos físicos
- Certifique-se de que a API está rodando
- Verifique o firewall

### Erro de CORS
- Confirme que `app.use(cors())` está no server.js
- Reinicie o servidor

## Documentação Adicional

- **[api/README.md](api/README.md)** - Documentação específica da API

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação em cada README
2. Consulte os logs do servidor
3. Verifique as mensagens de erro no app

## 👨‍💻 Autor

**Teste Técnico - FarmaUP**  
Estagiário de Desenvolvimento

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica para a posição de Estagiário de Desenvolvimento na FarmaUP.

---

