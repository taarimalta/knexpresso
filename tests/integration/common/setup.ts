import {KNEXPRESSO_LOGGER} from "../../../src/utils/logger.util";
import {Knex} from "knex";

export async function setupDatabase(db: Knex): Promise<void> {
    try {
        await db.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email').notNullable().unique();
        });

        await db('users').insert([
            { name: 'Alice', email: 'alice@example.com' },
            { name: 'Bob', email: 'bob@example.com' }
        ]);

        KNEXPRESSO_LOGGER.info('Database setup complete.');
    } catch (err: any) {
        KNEXPRESSO_LOGGER.error(`Error setting up database: ${err.message}`);
    }
}
