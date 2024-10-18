import { Server } from "http";
import { Knex } from "knex";
import KnexpressoServer from "../../src/server";
import { getKnexConnection } from "../../src/utils/connection.util";
import { KnexpressoConfig } from "../../src/types/knexConfig.type";
import { setupDatabase } from "./testSetup";
import { cleanupDatabase } from "./testCleanup";
import { startKnexpresso } from "../../src";

// Helper to start the test server with the right dependencies
export async function startTestServer(
  config: KnexpressoConfig,
  db: Knex | undefined = undefined,
): Promise<{ server: Server; db: Knex }> {
  if (!db) db = getKnexConnection(config);

  // Optionally setup the database (only for integration tests)
  await setupDatabase(db);

  const server = (await startKnexpresso(config)) as Server;

  return { server, db };
}

// Helper to stop the test server and clean up the database
export async function stopTestServer(server: Server, db: Knex): Promise<void> {
  // Stop the Knexpresso server
  await KnexpressoServer.stop(server);

  // Cleanup the database
  await cleanupDatabase(db); // Custom logic to clean up database state
}
