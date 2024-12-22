const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const tripRoutes= require("./routes/trips");
const bookingRoutes = require("./routes/bookings");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
    res.send("Travel Backend is working");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});