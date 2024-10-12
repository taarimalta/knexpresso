import { Knex } from 'knex';

export async function cleanupDatabase(db: Knex): Promise<void> {
    await db.schema.dropTableIfExists('users');
    await db.destroy(); // Close the connection
}
