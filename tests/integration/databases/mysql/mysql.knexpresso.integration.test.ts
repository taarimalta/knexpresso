import { startKnexpresso } from "../../../../src";
import { getKnexConnection } from "../../../../src/utils/connection.util";
import { mysqlConfig } from "../../configs/mysql.knexpressoConfig";
import { cleanupIntegrationTestDatabase } from "../../common/cleanup";
import { Server } from "http";
import { setupIntegrationTestDatabase } from "../../common/setup";
import request from "supertest";

let server: Server;
const db = getKnexConnection(mysqlConfig);

beforeAll(async () => {
  console.log("Starting server...");
  server = await startKnexpresso(mysqlConfig);
  console.log("Server started.");

  // Set up the database schema and initial data
  await setupIntegrationTestDatabase(db);
});

afterAll(async () => {
  console.log("Stopping server...");

  // Explicitly stop the server to avoid open handles
  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  await cleanupIntegrationTestDatabase(db);

  console.log("Server stopped.");
});

describe("MySQL Integration Tests for Knexpresso API", () => {
  it("should fetch all users", async () => {
    const response = await request(server).get("/api/users");
    console.log("Response:", response.status, response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
    const userNames = response.body.data.map((user: any) => user.name);
    expect(userNames).toContain("Alice");
    expect(userNames).toContain("Bob");
  });

  it("should fetch a single user by ID", async () => {
    // Fetch Alice's ID from the database
    const [alice] = await db("users")
      .where({ email: "alice@example.com" })
      .select("id");
    const aliceId = alice.id;

    const response = await request(server).get(`/api/users?id=${aliceId}`);
    console.log("Response:", response.status, response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].name).toBe("Alice");
  });

  it("should return an empty result for a non-existent user ID", async () => {
    const response = await request(server).get("/api/users?id=999");
    console.log("Response:", response.status, response.body);
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(0);
  });
});
