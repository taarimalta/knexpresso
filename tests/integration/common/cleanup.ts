import { Knex } from 'knex';

export async function cleanupIntegrationTestDatabase(db: Knex): Promise<void> {
    // Clean up the database before each test
    await db('addresses').del();
    await db('orders').del();
    await db('users').del();

    // Reset sequences
    await db.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await db.raw('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
    await db.raw('ALTER SEQUENCE addresses_id_seq RESTART WITH 1');

    await db.destroy();
}
