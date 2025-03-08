const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Category",
            default: null
        },
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },
    },
    { timestamps: true }
);

categorySchema.index({ parentCategory: 1 });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;