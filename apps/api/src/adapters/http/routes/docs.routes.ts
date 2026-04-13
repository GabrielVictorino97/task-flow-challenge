import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";

const router = Router();

const swaggerPath = path.resolve(__dirname, "../../../docs/swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.get("/swagger.json", (_, res) => {
  res.json(swaggerDocument);
});

export default router;