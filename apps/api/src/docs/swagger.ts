import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  failOnErrors: true,
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Task Flow Challenge API",
      version: "1.0.0",
      description: "API de gerenciamento de tarefas com arquitetura hexagonal"
    },
    servers: [{ url: "http://localhost:3333/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        ApiSuccess: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {}
          }
        },
        ApiError: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string" },
                message: { type: "string" },
                details: {}
              }
            }
          }
        },
        RegisterRequest: {
          type: "object",
          required: ["fullName", "email", "password"],
          properties: {
            fullName: { type: "string", minLength: 3, maxLength: 120, example: "Gabriel Silva" },
            email: { type: "string", format: "email", example: "gabriel@email.com" },
            password: { type: "string", minLength: 6, maxLength: 64, example: "senha123" }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "gabriel@email.com" },
            password: { type: "string", minLength: 6, maxLength: 64, example: "senha123" }
          }
        },
        LoginResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
              }
            }
          }
        },
        RegisterResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
                fullName: { type: "string", example: "Gabriel Silva" },
                email: { type: "string", example: "gabriel@email.com" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" }
              }
            }
          }
        },
        Task: {
          type: "object",
          properties: {
            id: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            title: { type: "string", example: "Estudar arquitetura hexagonal" },
            description: { type: "string", example: "Ler artigo e ajustar projeto" },
            status: { type: "string", enum: ["pending", "in_progress", "done"], example: "pending" },
            ownerId: { type: "string", example: "64f1a2b3c4d5e6f7a8b9c0d2" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        TaskResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/Task" }
          }
        },
        TaskListResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Task" }
            }
          }
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", minLength: 1, maxLength: 120, example: "Estudar arquitetura hexagonal" },
            description: { type: "string", maxLength: 1000, example: "Ler artigo e ajustar projeto" },
            status: { type: "string", enum: ["pending", "in_progress", "done"], example: "pending" }
          }
        },
        BulkCreateTaskRequest: {
          type: "object",
          required: ["tasks"],
          properties: {
            tasks: {
              type: "array",
              minItems: 1,
              maxItems: 1000,
              items: { $ref: "#/components/schemas/CreateTaskRequest" }
            }
          }
        },
        UpdateTaskRequest: {
          type: "object",
          properties: {
            title: { type: "string", minLength: 1, maxLength: 120, example: "Novo título" },
            description: { type: "string", maxLength: 1000, example: "Nova descrição" },
            status: { type: "string", enum: ["pending", "in_progress", "done"], example: "in_progress" }
          }
        },
        TaskStatusResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { type: "string", enum: ["pending", "in_progress", "done"] },
              example: ["pending", "in_progress", "done"]
            }
          }
        }
      }
    }
  },
  apis: [
    "./src/adapters/http/routes/*.ts",
    "./src/docs/*.yaml"
  ]
});
