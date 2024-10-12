import request from 'supertest';
import { Server } from 'http';
import { Knex } from 'knex';
import express from 'express';
import KnexpressoServer from '../../../src/server';
import { getKnexConnection } from '../../../src/utils/connection.util';
import { KnexpressoConfig } from '../../../src/types/knexConfig.type';

// Mock Data Generation - Hardcoded

export function generateMockUserData() {
    return [
        {
            id: 1,
            name: 'Alice',
            email: 'alice@example.com'
        },
        {
            id: 2,
            name: 'Bob',
            email: 'bob@example.com'
        },
        {
            id: 3,
            name: 'Charlie',
            email: 'charlie@example.com'
        }
    ];
}

// HTTP Request Wrappers

export async function getUsers(server: Server, queryParams = '') {
    return request(server)
        .get(`/api/users${queryParams}`)
        .set('Accept', 'application/json');
}

// Response Validation

export function expectSuccessResponse(response: request.Response) {
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('data');
}

export function expectErrorResponse(response: request.Response, statusCode: number, errorMessage: string) {
    expect(response.status).toBe(statusCode);
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', errorMessage);
}

// Database Utilities

export async function insertTestUser(db: Knex, user: Record<string, any>) {
    return db('users').insert(user);
}

export async function deleteAllUsers(db: Knex) {
    return db('users').del();
}

export async function userExists(db: Knex, email: string): Promise<boolean> {
    const user = await db('users').where('email', email).first();
    return !!user;
}

// General Utilities

export function buildQueryParams(params: Record<string, any>): string {
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : '';
}

// Error Handling

export function logAndExit(error: Error, context: string) {
    console.error(`[Error in ${context}]: ${error.message}`);
    process.exit(1);
}

// Server Setup and Teardown

export async function setupTestServer(config: KnexpressoConfig): Promise<{ server: Server, db: Knex }> {
    const db = getKnexConnection(config);
    await deleteAllUsers(db);  // Clean state before starting tests

    const router = express.Router();  // Create a default router instance
    const server = await KnexpressoServer.start({
        db,
        router,
        serverConfig: { port: 3000 },
    });

    return { server, db };
}

export async function teardownTestServer(server: Server, db: Knex): Promise<void> {
    await KnexpressoServer.stop(server);
    await deleteAllUsers(db);  // Clean up after all tests
}
