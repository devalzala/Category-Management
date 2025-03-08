const express = require("express");
const { createCategory, updateCategory, deleteCategory, getCategories, searchCategory, getCategoryById } = require("../controllers/categoryController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Auth Routes
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);
router.get("/", authMiddleware, getCategories);
router.post("/searchcategory", authMiddleware, searchCategory);
router.get("/getcategorybyid/:id", authMiddleware, getCategoryById);

module.exports = router;