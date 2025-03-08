require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const categoryRoute = require("./routes/categoryRoute");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request body

// Use API Routes
app.use("/api/auth", authRoute);
app.use("/api/category", categoryRoute);

if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app; // Exporting app for testing