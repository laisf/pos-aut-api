# POS Auto API

API REST desenvolvida em Node.js e Express para aprendizado de testes e automação. Esta API implementa funcionalidades básicas de gerenciamento de usuários e transferências financeiras.

##  Funcionalidades

- **Autenticação JWT**: Sistema de login com tokens JWT
- **Gerenciamento de Usuários**: Registro, consulta e listagem de usuários
- **Transferências**: Sistema de transferências com regras de negócio
- **Documentação Swagger**: API documentada e testável
- **Testes Automatizados**: Suite de testes com Mocha, Chai e Supertest
- **Testes Baseados em Riscos**: Análise de riscos críticos e cenários de segurança
- **CI/CD Pipeline**: Integração contínua com GitHub Actions
- **Cobertura de Código**: Relatórios de cobertura com nyc

##  Regras de Negócio

1. **Login**: Email e senha são obrigatórios para autenticação
2. **Usuários Duplicados**: Não é possível registrar usuários com email duplicado
3. **Transferências**: 
   - Transferências para usuários não favorecidos limitadas a R$ 5.000,00
   - Transferências para usuários favorecidos sem limite de valor
   - Saldo insuficiente impede transferências
4. **Autenticação**: Todas as rotas de transferência requerem token JWT válido

##  Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticação via tokens
- **bcryptjs** - Criptografia de senhas
- **Swagger** - Documentação da API
- **Mocha/Chai/Supertest** - Testes automatizados
- **Sinon** - Mocks e stubs
- **nyc** - Cobertura de código
- **GitHub Actions** - CI/CD

##  Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd pos-aut-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
# Crie um arquivo .env
JWT_SECRET=sua-chave-secreta-aqui
PORT=3000
NODE_ENV=development
```

##  Executando a API

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

A API estará disponível em `http://localhost:3000`

##  Documentação

A documentação interativa da API está disponível em:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/health`

##  Testes

### Executar todos os testes
```bash
npm test
```

### Executar testes em modo watch
```bash
npm run test:watch
```

### Executar testes com cobertura
```bash
npm run test:coverage
```

### Estratégia de Testes

#### **Testes de API (7 testes)**
- Validação de endpoints REST
- Cenários de sucesso e erro
- Autenticação JWT

#### **Testes de Controller (7 testes)**
- Testes isolados com Sinon
- Mocks de serviços
- Validação de lógica de negócio

#### **Testes Baseados em Riscos (9 testes)**
- **Segurança**: Tokens JWT, sanitização de inputs
- **Integridade Financeira**: Valores inválidos, operações concorrentes
- **Performance**: Múltiplas requisições simultâneas
- **Lógica de Negócio**: Regras para usuários favorecidos
- **Consistência de Dados**: Falhas em transferências, registro correto

### Cobertura de Código
A API possui **80.22% de cobertura de código** com os seguintes resultados:

```
-------------------------|---------|----------|---------|---------|------------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s      
-------------------------|---------|----------|---------|---------|------------------------
All files                |    80.22|    66.03 |   68.57 |   79.76 |                       
 pos-aut-api             |   84.61 |        0 |       0 |   84.61 |                       
  app.js                 |   84.61 |        0 |       0 |   84.61 | 42,55,63-64           
 pos-aut-api/config      |     100 |      100 |     100 |     100 |                       
  swagger.js             |     100 |      100 |     100 |     100 |                       
 pos-aut-api/controllers |   72.97 |      100 |   71.42 |   72.97 |                       
  transferController.js  |   47.05 |      100 |   33.33 |   47.05 | 28-51                 
  userController.js      |      95 |      100 |     100 |      95 | 41                    
 pos-aut-api/middleware  |   83.33 |       75 |     100 |   83.33 |                       
  auth.js                |   83.33 |       75 |     100 |   83.33 | 8,16                  
 pos-aut-api/models      |   87.87 |    57.14 |   81.25 |    86.2 |                       
  Transfer.js            |   66.66 |        0 |      40 |   66.66 | 24-30                 
  User.js                |   95.83 |       80 |     100 |      95 | 59                    
 pos-aut-api/routes      |     100 |      100 |     100 |     100 |                       
  transferRoutes.js      |     100 |      100 |     100 |     100 |                       
  userRoutes.js          |     100 |      100 |     100 |     100 |                       
 pos-aut-api/services    |   69.38 |    69.44 |   57.14 |   69.38 |                       
  transferService.js     |   70.37 |    68.42 |   33.33 |   70.37 | 7,11,15,22,26,30,57-61
  userService.js         |   68.18 |    70.58 |      75 |   68.18 | 9,17,22,54-58         
-------------------------|---------|----------|---------|---------|------------------------
```

### Testes Implementados
-  **23 testes passando** (100% de sucesso)
-  Criação e validação de usuários
-  Autenticação JWT
-  Transferências financeiras
-  Testes isolados de Controller
-  Análise de riscos de segurança
-  Validação de integridade financeira
-  Testes de performance
-  Consistência de dados

##  Endpoints da API

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/users` | Registrar novo usuário |  |
| POST | `/users/login` | Fazer login |  |
| GET | `/users` | Listar todos os usuários |  |
| GET | `/users/:id` | Buscar usuário por ID |  |

### Transferências

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/transfers` | Criar transferência |  |
| GET | `/transfers/my` | Minhas transferências |  |
| GET | `/transfers` | Listar todas transferências |  |

##  Autenticação

Para acessar endpoints protegidos, inclua o token JWT no header:

```
Authorization: Bearer <seu-token-jwt>
```

##  Exemplos de Uso

### 1. Registrar Usuário
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "123456",
    "name": "João Silva",
    "isFavorecido": false
  }'
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "123456"
  }'
```

### 3. Criar Transferência
```bash
curl -X POST http://localhost:3000/transfers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "toUserId": 2,
    "amount": 1000,
    "description": "Transferência de teste"
  }'
```

##  Estrutura do Projeto

```
pos-aut-api/
 controllers/          # Controladores da API
    userController.js
    transferController.js
 services/            # Lógica de negócio
    userService.js
    transferService.js
 models/              # Modelos de dados
    User.js
    Transfer.js
 routes/              # Definição das rotas
    userRoutes.js
    transferRoutes.js
 middleware/          # Middlewares customizados
    auth.js
 config/              # Configurações
    swagger.js
 test/                # Testes automatizados
    api.test.js              # Testes de API
    controller.test.js       # Testes de Controller
    risk-based.test.js       # Testes baseados em riscos
 .github/workflows/   # CI/CD Pipeline
    ci.yml
 app.js               # Configuração da aplicação
 server.js            # Servidor
 package.json
 README.md
 examples.md          # Exemplos de uso detalhados
```

##  Configuração de Desenvolvimento

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `JWT_SECRET` | Chave secreta para JWT | 'default-secret' |
| `NODE_ENV` | Ambiente de execução | 'development' |

### Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon
- `npm test` - Executa os testes
- `npm run test:watch` - Executa os testes em modo watch
- `npm run test:coverage` - Executa os testes com relatório de cobertura

##  CI/CD Pipeline

O projeto inclui uma pipeline de CI/CD configurada com GitHub Actions que executa:

- **Testes Automatizados**: Execução de todos os testes em Node.js 18.x e 20.x
- **Cobertura de Código**: Geração de relatórios de cobertura
- **Auditoria de Segurança**: Verificação de vulnerabilidades
- **Build da Aplicação**: Compilação e validação do código

### Status da Pipeline
![CI/CD Pipeline](https://github.com/laisf/pos-aut-api/workflows/CI/CD%20Pipeline/badge.svg)

##  Métricas de Qualidade

- **Cobertura de Código**: 80.22%
- **Testes Passando**: 23/23 (100%)
- **Dependências**: 0 vulnerabilidades conhecidas
- **Rate Limiting**: 100 requests por IP a cada 15 minutos
- **Estratégia de Testes**: Baseada em análise de riscos

##  Estratégia de Testes

### **Análise de Riscos (Risk-Based Testing)**
- Foco nos cenários mais críticos para o negócio
- Identificação de vulnerabilidades de segurança
- Validação de integridade financeira

### **Melhores Práticas Ágeis**
- Testes rápidos e focados
- Feedback contínuo para desenvolvedores
- Cobertura de edge cases

### **Conformidade com Normas ISO**
- ISO/IEC 25010: Características de qualidade
- ISO/IEC 29119: Processos de teste
- Validação de funcionalidade, performance e segurança

### **Princípios RST (Rapid Software Testing)**
- Testes baseados em heurísticas
- Foco em cenários de risco
- Validação de comportamento real da API

##  Limitações

- Banco de dados em memória (dados são perdidos ao reiniciar)
- Rate limiting: 100 requests por IP a cada 15 minutos
- Transferências limitadas a R$ 5.000 para usuários não favorecidos

##  Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

##  Documentação Adicional

- [Exemplos de Uso Detalhados](examples.md)
- [Documentação Swagger](http://localhost:3000/api-docs)
- [Health Check](http://localhost:3000/health)
