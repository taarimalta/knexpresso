import knexpressoConfig from "./knexpresso.config.test-config";
import { Server } from "http";
import { getKnexConnection } from "../../src/utils/connection.util";
import { startTestServer, stopTestServer } from "../common/testHelpers";
import { Knex } from "knex";
import request from "supertest";

let server: Server;
let db: Knex;

beforeAll(async () => {
  db = getKnexConnection(knexpressoConfig);

  console.log("Creating Users");
  await db.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
  });

  console.log("Creating Orders");
  await db.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable().references("id").inTable("users");
    table.float("amount").notNullable();
  });

  console.log("Creating Addresses");
  await db.schema.createTable("addresses", (table) => {
    table.increments("id").primary();
    table.string("street").notNullable();
    table.string("city").notNullable();
    table.integer("user_id").notNullable().references("id").inTable("users");
  });

  const { server: testServer } = await startTestServer(knexpressoConfig, db);
  server = testServer;
});

afterAll(async () => {
  await stopTestServer(server, db);
  await db.destroy();
});

// Dictionary structure for describe blocks and their test cases
const testSuites: Record<string, Record<string, () => Promise<void>>> = {
  "Knexpresso REST API GET Tests": {
    "should fetch all users": async () => {
      const response = await request(server).get("/api/users");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    },
    "should fetch a single user by ID": async () => {
      const response = await request(server).get("/api/users?id=1");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].id).toBe(1);
    },
    "should fetch a limited number of users": async () => {
      const response = await request(server).get("/api/users?limit=1");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
    },
    "should fetch users based on query filters": async () => {
      const response = await request(server).get("/api/users?name=Alice");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe("Alice");
    },
    "should fetch all orders": async () => {
      const response = await request(server).get("/api/orders");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
    },
    "should fetch orders for a specific user": async () => {
      const response = await request(server).get("/api/orders?user_id=1");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].user_id).toBe(1);
    },
    "should return an empty result for a non-existent user ID": async () => {
      const response = await request(server).get("/api/users?id=999");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.length).toBe(0);
    },
    "should return a 404 error for a non-existent route": async () => {
      const response = await request(server).get("/api/nonexistent");
      expect(response.status).toBe(404);
    },
    "should fetch all addresses": async () => {
      const response = await request(server).get("/api/addresses");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    },
    "should fetch addresses for a specific user": async () => {
      const response = await request(server).get("/api/addresses?user_id=1");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].user_id).toBe(1);
    },
    "should return an empty result for a non-existent user address":
      async () => {
        const response = await request(server).get(
          "/api/addresses?user_id=999",
        );
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.length).toBe(0);
      },
  },
  "Exists Feature Tests": {
    "should check if a user exists with specific email": async () => {
      const response = await request(server).get(
        "/api/users?exists=true&email=alice@example.com",
      );
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.exists).toBe(true);
    },
    "should return false if a user does not exist with specific email":
      async () => {
        const response = await request(server).get(
          "/api/users?exists=true&email=nonexistent@example.com",
        );
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.exists).toBe(false);
      },
    "should check if any order exists for a specific user": async () => {
      const response = await request(server).get(
        "/api/orders?exists=true&user_id=1",
      );
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.exists).toBe(true);
    },
    "should return false if no order exists for a non-existent user":
      async () => {
        const response = await request(server).get(
          "/api/orders?exists=true&user_id=999",
        );
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.exists).toBe(false);
      },
  },
  "Count Feature Tests": {
    "should count the number of users": async () => {
      const response = await request(server).get("/api/users?count=true");
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.count).toBe(2);
    },
    "should count the number of orders for a specific user": async () => {
      const response = await request(server).get(
        "/api/orders?count=true&user_id=1",
      );
      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.count).toBe(1);
    },
    "should return a count of 0 if no orders exist for a specific user":
      async () => {
        const response = await request(server).get(
          "/api/orders?count=true&user_id=999",
        );
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body.data.count).toBe(0);
      },
  },
};

// Iterate over the dictionary and dynamically create tests
Object.entries(testSuites).forEach(([describeBlock, tests]) => {
  describe(describeBlock, () => {
    Object.entries(tests).forEach(([itBlock, testFn]) => {
      it(itBlock, testFn);
    });
  });
});
