
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors'); // Import CORS middleware

const app = express();
const PORT = 3005;
const JWT_SECRET = 'your_secret_key'; // Change this to a secure random string

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/database_database11")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

// Define schema for user model
const userSchema = new mongoose.Schema({
    Myemail: {
        type: String,
        required: true,
        unique: true
    },
    Myusername: {
        type: String,
        required: true
    },
    Mypassword: {
        type: String,
        required: true
    }
});

// Create user model
const UserModel = mongoose.model("User", userSchema);

app.listen(PORT, () => {
    console.log(`Server is running on port number ${PORT}`);
});

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(cors()); // Use CORS middleware

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token Verification Error:', error);
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

// Sign up endpoint
app.post("/contact", async (req, res) => {
    const { Myemail, Myusername, Mypassword } = req.body;

    try {
        const existingUser = await UserModel.findOne({ Myemail });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(Mypassword, 10);
        const newUser = new UserModel({ Myemail, Myusername, Mypassword: hashedPassword });
        await newUser.save();

        console.log("Signup Data:", { Myemail, Myusername, Mypassword: hashedPassword });

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
        res.status(200).json({ message: "Signup successful", token });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Login endpoint
app.post("/contact1", async (req, res) => {
    const { Myemail, Mypassword } = req.body;

    try {
        const user = await UserModel.findOne({ Myemail });

        if (user && (await bcrypt.compare(Mypassword, user.Mypassword))) {
            const token = jwt.sign({ id: user._id }, JWT_SECRET);
            res.status(200).json({ message: "Login successful", token });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Protected endpoint
app.get("/protected", verifyToken, (req, res) => {
    res.status(200).json({ message: "Protected endpoint accessed successfully", user: req.user });
});

// New Protected endpoint
app.get("/new_protected", verifyToken, (req, res) => {
    res.status(200).json({ message: "New Protected endpoint accessed successfully", user: req.user });
});
