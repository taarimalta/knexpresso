import { Server } from 'http';
import { Knex } from 'knex';
import { mysqlConfig } from '../../configs/mysql.knexpressoConfig';
import {
    setupTestServer,
    teardownTestServer,
    generateMockUserData,
    deleteAllUsers,
    getUsers,
    expectSuccessResponse
} from '../../common/testUtils';

let server: Server;
let db: Knex<any, any[]>;

beforeAll(async () => {
    ({ server, db } = await setupTestServer(mysqlConfig));
});

afterAll(async () => {
    await teardownTestServer(server, db);
});

describe('MySQL Integration Tests for Knexpresso API', () => {
    beforeEach(async () => {
        await deleteAllUsers(db);
        const mockUsers = generateMockUserData();
        await db('users').insert(mockUsers);
    });

    it('should fetch all users', async () => {
        const response = await getUsers(server);
        expectSuccessResponse(response);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should fetch a single user by ID', async () => {
        const response = await getUsers(server, '?id=1');
        expectSuccessResponse(response);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].name).toBe('Alice');
    });
});
