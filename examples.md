# Exemplos de Uso da API

## 1. Registrar Usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456",
    "name": "João Silva",
    "isFavorecido": false
  }'
```

**Resposta:**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "email": "joao@example.com",
    "name": "João Silva",
    "isFavorecido": false,
    "balance": 0
  }
}
```

## 2. Fazer Login

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "joao@example.com",
    "name": "João Silva",
    "isFavorecido": false,
    "balance": 0
  }
}
```

## 3. Listar Usuários

```bash
curl -X GET http://localhost:3000/users
```

**Resposta:**
```json
{
  "users": [
    {
      "id": 1,
      "email": "joao@example.com",
      "name": "João Silva",
      "isFavorecido": false,
      "balance": 0,
      "createdAt": "2025-09-20T16:30:00.000Z"
    }
  ],
  "total": 1
}
```

## 4. Criar Transferência (Requer Autenticação)

```bash
curl -X POST http://localhost:3000/transfers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "toUserId": 2,
    "amount": 1000,
    "description": "Transferência de teste"
  }'
```

**Resposta:**
```json
{
  "message": "Transferência realizada com sucesso",
  "transfer": {
    "id": 1,
    "fromUserId": 1,
    "toUserId": 2,
    "amount": 1000,
    "description": "Transferência de teste",
    "status": "completed",
    "createdAt": "2025-09-20T16:30:00.000Z"
  }
}
```

## 5. Listar Minhas Transferências (Requer Autenticação)

```bash
curl -X GET http://localhost:3000/transfers/my \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Resposta:**
```json
{
  "transfers": [
    {
      "id": 1,
      "fromUserId": 1,
      "toUserId": 2,
      "amount": 1000,
      "description": "Transferência de teste",
      "status": "completed",
      "createdAt": "2025-09-20T16:30:00.000Z"
    }
  ],
  "total": 1
}
```

## 6. Health Check

```bash
curl -X GET http://localhost:3000/health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-20T16:30:00.000Z",
  "uptime": 123.456
}
```

## 7. Documentação Swagger

Acesse: http://localhost:3000/api-docs

## Regras de Negócio

1. **Usuários Duplicados**: Não é possível registrar usuários com email duplicado
2. **Transferências para Não Favorecidos**: Limitadas a R$ 5.000,00
3. **Transferências para Favorecidos**: Sem limite de valor
4. **Saldo Insuficiente**: Impede transferências quando o saldo é menor que o valor
5. **Autenticação**: Todas as rotas de transferência requerem token JWT válido

## Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Token inválido
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor
