import cors from "cors";
import express from "express";
import { router } from "./adapters/http/routes";
import { errorHandlerMiddleware } from "./adapters/http/middleware/ErrorHandler";
import { notFoundMiddleware } from "./adapters/http/middleware/NotFound";
import { sanitizeMiddleware } from "./adapters/http/middleware/Sanitize";
import { env } from "./adapters/helpers/env";
import docsRoutes from "./adapters/http/routes/docs.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";


export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true
    })
  );

  app.get("/docs/swagger.json", (_req, res) => {
    res.json(swaggerSpec);
  });
  app.use(express.json());
  app.use(sanitizeMiddleware);

  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, data: { status: "ok" } });
  });

  app.use("/api", router);
  app.use("/docs", docsRoutes);
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
}
