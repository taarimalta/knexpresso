import request from 'supertest';
import { Server } from 'http';

export function runCommonTests(server: Server) {
    describe('Common Integration Tests', () => {
        it('should fetch all users', async () => {
            const response = await request(server).get('/api/users');
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
        });

        // Add more shared tests here
    });
}
