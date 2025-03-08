const Category = require("../models/category")
const mongoose = require("mongoose")


exports.createCategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required", success: false });
        }

        const category = await Category.create({ name, parentCategory });

        return res.status(201).json({ data: category, message: "Category created successfully", success: true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;

        if (!name && !status) {
            return res.status(400).json({ message: "Nothing to update", success: false });
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found", success: false });
        }

        category.name = name || category.name;
        category.status = status || category.status;
        await category.save();

        if (category.parentCategory == null) {
            await Category.updateMany({ parentCategory: category._id }, { status: category.status });
        }

        return res.status(200).json({ data: category, message: "Category updated successfully", success: true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found", success: false });
        }

        await Category.findByIdAndDelete(id);

        if (category.parentCategory !== null) {
            await Category.updateMany({ parentCategory: category._id }, { parentCategory: category.parentCategory });
        }

        return res.status(200).json({ message: "Category deleted successfully", success: true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).populate("parentCategory").lean().exec();

        return res.status(200).json({ data: categories, message: "Categories fetched successfully", success: true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

exports.searchCategory = async (req, res) => {
    try {
        const { search } = req.body;
        const limit = 5;

        let findObject = {
            name: { $regex: search.trim(), $options: "i" },
        };

        const categories = await Category.find(findObject).sort({ createdAt: -1 }).limit(limit).lean().exec();

        return res.status(200).json({
            success: true,
            data: categories,
            message: "Search results fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: "Error searching category", success: false });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid category ID", success: false });
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found", success: false });
        }

        return res.status(200).json({ data: category, message: "Category fetched successfully", success: true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
