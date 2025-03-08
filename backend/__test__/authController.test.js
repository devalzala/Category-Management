const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../models/user");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Register a user
    describe("POST /api/auth/register", () => {
        it("should return 400 if user already exists", async () => {
            User.findOne.mockResolvedValue({ email: "john@example.com" });

            const res = await request(app)
                .post("/api/auth/register")
                .send({ name: "John Doe", email: "john@example.com", password: "password123" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("User already exists");
        });
    });


    // Login a user
    describe("POST /api/auth/login", () => {
        it("should return 400 for invalid credentials", async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "john@example.com", password: "wrongpassword" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid credentails");
        });

        it("should return 400 if password is incorrect", async () => {
            const mockUser = { _id: "1", email: "john@example.com", password: "hashedpassword" };
            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "john@example.com", password: "wrongpassword" });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid credentails");
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});
