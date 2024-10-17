import { Knex } from 'knex';

export async function setupIntegrationTestDatabase(db: Knex): Promise<void> {
    await db.transaction(async (trx) => {
        // Insert users and get their IDs
        const insertedUsers = await trx('users')
          .insert([
              { name: 'Alice', email: 'alice@example.com' },
              { name: 'Bob', email: 'bob@example.com' },
          ])
          .returning('id'); // Return only the 'id' field

        console.log('Inserted Users:', insertedUsers);

        // If insertedUsers is an array of integers
        // const aliceId = insertedUsers[0];
        // const bobId = insertedUsers[1];

        // If insertedUsers is an array of objects, use the following instead:
        const aliceId = insertedUsers[0].id;
        const bobId = insertedUsers[1].id;

        console.log('Alice ID:', aliceId);
        console.log('Bob ID:', bobId);

        // Insert orders using the generated user IDs
        await trx('orders').insert([
            { user_id: aliceId, amount: 250.0 },
            { user_id: bobId, amount: 150.5 },
        ]);

        // Insert addresses using the generated user IDs
        await trx('addresses').insert([
            { user_id: aliceId, street: '123 Main St', city: 'Wonderland' },
            { user_id: bobId, street: '456 Elm St', city: 'Springfield' },
        ]);
    });
}
