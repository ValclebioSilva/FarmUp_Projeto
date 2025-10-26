# FarmaUP - Cliente Flutter

Aplicativo mobile desenvolvido em Flutter para gerenciamento de clientes, consumindo a API REST FarmaUP.

## 🚀 Tecnologias

- Flutter
- Dart
- HTTP package para consumo de API

## 📱 Funcionalidades

### ✅ Implementadas

- **Listar Clientes**: Visualize todos os clientes cadastrados
- **Buscar Clientes**: Busque por nome ou cidade
- **Cadastrar Cliente**: Adicione novos clientes
- **Editar Cliente**: Atualize informações de clientes existentes
- **Excluir Cliente**: Remova clientes com confirmação
- **Validações**: Validação de email, telefone e campos obrigatórios
- **Tratamento de Erros**: Mensagens amigáveis para erros
- **Pull to Refresh**: Atualize a lista deslizando para baixo
- **Loading States**: Indicadores de carregamento
- **Responsivo**: Interface adaptável

## 📐 Estrutura do Projeto

```
lib/
├── main.dart                           # Ponto de entrada
├── models/
│   └── cliente.dart                    # Modelo de dados Cliente
├── services/
│   └── api_service.dart               # Serviço de comunicação com API
└── screens/
    ├── clientes_list_screen.dart      # Tela de listagem
    └── cliente_form_screen.dart       # Tela de formulário
```

## 🎨 Interface

### Tela Principal
- Lista de clientes com cards
- Busca por nome ou cidade
- Botões de editar e excluir
- Botão flutuante para adicionar
- Pull to refresh

### Tela de Formulário
- Validação em tempo real
- Campos formatados
- Estados de loading
- Mensagens de sucesso/erro

## 🔌 Integração com API

O aplicativo consome os seguintes endpoints:

- `GET /clientes` - Lista clientes
- `GET /clientes?nome=...` - Busca por nome
- `GET /clientes?cidade=...` - Busca por cidade
- `GET /clientes/:id` - Busca cliente específico
- `POST /clientes` - Cria novo cliente
- `PUT /clientes/:id` - Atualiza cliente
- `DELETE /clientes/:id` - Exclui cliente

## 🗄️ Comandos do Banco de Dados

```bash
# Banco de Dados
npm run prisma:generate    # Gerar cliente Prisma
npm run prisma:migrate     # Executar migrações
npm run prisma:seed        # Popular banco
```


## 📝 Validações Implementadas

- **Nome**: Mínimo 3 caracteres, obrigatório
- **Email**: Formato válido, obrigatório, não pode duplicar
- **Telefone**: 10 ou 11 dígitos, apenas números
- **Cidade**: Mínimo 3 caracteres, obrigatório

## 🎯 Funcionalidades Bônus

✅ Busca por nome parcial  
✅ Filtro por cidade  
✅ Validação de email duplicado  
✅ Interface moderna e intuitiva  
✅ Feedback visual (loading, erros, sucesso)  
✅ Confirmação antes de excluir  
✅ Pull to refresh  

## 👨‍💻 Autor

Desenvolvido para o Teste Técnico FarmaUP - Valclébio Rodrigues da Silva

