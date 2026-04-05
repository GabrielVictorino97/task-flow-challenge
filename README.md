# Task Flow Challenge

Aplicação de gerenciamento de tarefas construída com React, Express, MongoDB e Arquitetura Hexagonal, focada em escalabilidade, manutenibilidade, segurança e testes automatizados.

## Tecnologias

- **API:** Node.js, Express, TypeScript, Mongoose
- **Banco de dados:** MongoDB (Docker)
- **Autenticação:** JWT
- **Validação:** Zod
- **Documentação:** Swagger (OpenAPI 3.0)
- **Testes:** Jest, Supertest

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

O arquivo `apps/api/.env` já está configurado para o ambiente local:

```env
PORT=3333
MONGO_URI=mongodb://root:root@localhost:27017/task_flow?authSource=admin
JWT_SECRET=super-secret-change-me
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:5173
```

### 3. Subir o banco de dados

```bash
docker compose up -d
```

O MongoDB estará disponível em `localhost:27017`. As collections `users` e `tasks` são criadas automaticamente na primeira inserção.

### 4. Iniciar a API

```bash
npm run dev:api
```

A API estará disponível em `http://localhost:3333`.

## Documentação

Acesse a documentação Swagger em:

```
http://localhost:3333/docs
```

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev:api` | Inicia a API em modo desenvolvimento |
| `npm run dev:web` | Inicia o frontend em modo desenvolvimento |
| `npm run build:api` | Gera o build da API |
| `npm run build:web` | Gera o build do frontend |
| `npm run test:api` | Executa os testes da API |

## Endpoints

### Auth
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastra um novo usuário |
| POST | `/api/auth/login` | Realiza login e retorna o token JWT |

### Tasks — requer `Authorization: Bearer <token>`
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/tasks` | Cria uma tarefa |
| POST | `/api/tasks/bulk` | Cria múltiplas tarefas |
| GET | `/api/tasks` | Lista todas as tarefas do usuário |
| GET | `/api/tasks/:id` | Busca uma tarefa pelo ID |
| PATCH | `/api/tasks/:id` | Atualiza uma tarefa |
| DELETE | `/api/tasks/:id` | Remove uma tarefa |

### Status das tarefas

- `pending` — pendente
- `in_progress` — em andamento
- `done` — concluída
