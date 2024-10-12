import {KnexpressoConfig} from "../../../src/types/knexConfig.type";

export const sqliteConfig: KnexpressoConfig = {
    database: {
        client: 'sqlite3',
        connection: {
            host: 'localhost',
            user: 'knexpresso',
            password: 'knexpresso_password',
            database: 'knexpresso_db',
        },
    },
    tables: [
        {
            name: 'users',
            expose: true,
            permissions: {
                read: true,
                write: true,
                delete: false,
            },
        },
    ],
};
