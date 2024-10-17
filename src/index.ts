import { KnexpressoConfig } from "./types/knexConfig.type";
import { KNEXPRESSO_LOGGER, setKnexpressoLogger } from "./utils/logger.util";
import { Logger } from "./types/logger.type";
import { getKnexConnection } from "./utils/connection.util";
import express from "express";
import { generateRoutes } from "./server/routes";
import { nonExistantAction } from "./controllers/nonExistantAction";
import { errorAction } from "./controllers/errorAction";
import { Server } from "http";

export function startKnexpresso(
  config: KnexpressoConfig,
  port?: number,
  logger?: Logger,
): Promise<Server> {
  if (!config) throw new Error("KnexpressoConfig is required");
  if (logger) setKnexpressoLogger(logger);

  const db = getKnexConnection(config);
  const app = express(); // Create the Express app

  // Middleware to parse JSON
  app.use(express.json());

  // Setup and generate routes
  const router = express.Router();
  generateRoutes(router, db, config);
  app.use("/api", router);

  // Global 404 handler for undefined routes
  app.use(nonExistantAction);

  // Global error handler (generic error handler)
  app.use(errorAction);

  const serverConfig = { port: port || 3000 };

  // Start the server
  return new Promise((resolve, reject) => {
    const server = app.listen(serverConfig.port, () => {
      KNEXPRESSO_LOGGER.info(
        `Knexpresso server started on port ${serverConfig.port}`,
      );
      resolve(server); // Resolve with the server instance
    });

    server.on("error", (err) => {
      KNEXPRESSO_LOGGER.error(`Failed to start server: ${err.message}`);
      reject(err); // Reject if server fails to start
    });
  });
}
