const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware Setup
app.use(cors());
app.use(express.json());

// 2. Routes Imports
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

// 3. Routes Middleware Link
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// 4. Basic Testing Route
app.get('/', (req, res) => {
    res.send("Digital Note-Book Server is Running!");
});

// 5. Database & Server Connection Logic
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("🔥 MongoDB Database Connected Successfully!");
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port: ${PORT}`);
    });
})
.catch((err) => {
    console.error("❌ Database Connection Error: ", err);
});