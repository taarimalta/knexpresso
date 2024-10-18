import { Knex } from "knex"; // Import Knex types

export async function cleanupDatabase(db: Knex): Promise<void> {
  // Clean up the database before each test
  await db("addresses").del();
  await db("orders").del();
  await db("users").del();

  const client = db.client.config.client;

  if (client === "pg") {
    // PostgreSQL: Reset sequences using raw SQL
    await db.raw("ALTER SEQUENCE users_id_seq RESTART WITH 1");
    await db.raw("ALTER SEQUENCE orders_id_seq RESTART WITH 1");
    await db.raw("ALTER SEQUENCE addresses_id_seq RESTART WITH 1");
  } else if (client === "mysql" || client === "mysql2") {
    // MySQL: Reset AUTO_INCREMENT without altering the table schema
    await db.raw("ALTER TABLE users AUTO_INCREMENT = 1");
    await db.raw("ALTER TABLE orders AUTO_INCREMENT = 1");
    await db.raw("ALTER TABLE addresses AUTO_INCREMENT = 1");
  } else if (client === "mssql") {
    // MSSQL: Reset IDENTITY columns using DBCC CHECKIDENT
    await db.raw("DBCC CHECKIDENT (users, RESEED, 0)");
    await db.raw("DBCC CHECKIDENT (orders, RESEED, 0)");
    await db.raw("DBCC CHECKIDENT (addresses, RESEED, 0)");
  }
  await db.destroy();
}
