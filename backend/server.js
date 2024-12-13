const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user_model");
const Notice = require("./models/notice_model"); // Assuming this is saved as notice_model.js

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust to your frontend URL
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "thisshouldbeasecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.ATLAS_DB_URI }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration for User Authentication
passport.use(
  "user-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    User.authenticate() // Use passport-local-mongoose method
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MongoDB connection
mongoose
  .connect(process.env.ATLAS_DB_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Failed to connect to DB:", err));

// Routes for Admin Notices
// Admin: Create a new notice
app.post("/api/admin/post", async (req, res) => {
  try {
    const { title, description, image, video, category, branch } = req.body;
    const createdBy = req.user._id; // Assume the user is authenticated

    const newNotice = new Notice({
      title,
      description,
      image,
      video,
      category,
      branch,
      createdBy,
    });

    await newNotice.save();
    res.status(201).json({
      success: true,
      message: "Notice created successfully!",
      notice: newNotice,
    });
  } catch (err) {
    console.error("Error creating notice:", err);
    res.status(500).json({ success: false, message: "Failed to create notice." });
  }
});

// Admin: Update a notice by ID
app.put("/api/admin/post/:id", async (req, res) => {
  try {
    const { title, description, image, video, category, branch } = req.body;
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, description, image, video, category, branch, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedNotice) {
      return res.status(404).json({ success: false, message: "Notice not found." });
    }

    res.json({ success: true, message: "Notice updated successfully!", notice: updatedNotice });
  } catch (err) {
    console.error("Error updating notice:", err);
    res.status(500).json({ success: false, message: "Failed to update notice." });
  }
});

// Admin: Delete a notice by ID
app.delete("/api/admin/post/:id", async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);

    if (!deletedNotice) {
      return res.status(404).json({ success: false, message: "Notice not found." });
    }

    res.json({ success: true, message: "Notice deleted successfully!" });
  } catch (err) {
    console.error("Error deleting notice:", err);
    res.status(500).json({ success: false, message: "Failed to delete notice." });
  }
});

// General Routes for Notices
// Get all notices
app.get("/api/notices", async (req, res) => {
  try {
    const notices = await Notice.find().populate("createdBy", "username email");
    res.json({ success: true, notices });
  } catch (err) {
    console.error("Error fetching notices:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notices." });
  }
});

// Get a single notice by ID
app.get("/api/notices/:id", async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate("createdBy", "username email");
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found." });
    }
    res.json({ success: true, notice });
  } catch (err) {
    console.error("Error fetching notice:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notice." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
