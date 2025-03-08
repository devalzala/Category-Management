const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const express = require("express");
const jwt = require("jsonwebtoken");
const categoryRoutes = require("../routes/categoryRoute");
const Category = require("../models/category");

jest.mock("../middleware/authMiddleware", () => ({
    authMiddleware: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/api/category", categoryRoutes);

let mongoServer;
let token;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const fakeUser = { id: "1234567890" };
    token = jwt.sign(fakeUser, process.env.JWT_SECRET || "test_secret", { expiresIn: "1h" });
});

afterEach(async () => {
    await Category.deleteMany();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Category Controller with Mock Database", () => {
    // Create a Category
    describe("POST /api/category", () => {
        it("should create a new category", async () => {
            const res = await request(app)
                .post("/api/category")
                .set("Authorization", `Bearer ${token}`) // ✅ Pass Auth Token
                .send({ name: "Electronics" });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category created successfully");

            // ✅ Check if data is in database
            const category = await Category.findOne({ name: "Electronics" });
            expect(category).not.toBeNull();
        });

        it("should return 400 if category name is missing", async () => {
            const res = await request(app)
                .post("/api/category")
                .set("Authorization", `Bearer ${token}`) // ✅ Pass Auth Token
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Category name is required");
        });
    });

    // Get All Categories
    describe("GET /api/category", () => {
        it("should fetch all categories", async () => {
            await Category.create({ name: "Electronics" });

            const res = await request(app)
                .get("/api/category")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0].name).toBe("Electronics");
        });
    });

    // Get Category by ID
    describe("GET /api/category/getcategorybyid/:id", () => {
        it("should fetch a category by ID", async () => {
            const category = await Category.create({ name: "Electronics" });

            const res = await request(app)
                .get(`/api/category/getcategorybyid/${category._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe("Electronics");
        });

        it("should return 404 if category is not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/category/getcategorybyid/${fakeId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Category not found");
        });
    });

    // Update a Category
    describe("PUT /api/category/:id", () => {
        it("should update a category", async () => {
            const category = await Category.create({ name: "Electronics" });

            const res = await request(app)
                .put(`/api/category/${category._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Updated Electronics" });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category updated successfully");

            const updatedCategory = await Category.findById(category._id);
            expect(updatedCategory.name).toBe("Updated Electronics");
        });
    });

    // Delete a Category
    describe("DELETE /api/category/:id", () => {
        it("should delete a category", async () => {
            const category = await Category.create({ name: "Electronics" });

            const res = await request(app)
                .delete(`/api/category/${category._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category deleted successfully");

            // ✅ Verify in DB
            const deletedCategory = await Category.findById(category._id);
            expect(deletedCategory).toBeNull();
        });
    });
});