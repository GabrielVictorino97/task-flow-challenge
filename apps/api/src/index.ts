import { createApp } from "./app";
import { connectDatabase } from "./adapters/database/mongoose/connection";
import { env } from "./adapters/helpers/env";

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start application", error);
  process.exit(1);
});
