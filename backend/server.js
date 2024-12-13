const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user_model");
const Notice = require("./models/notice_model");

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

// User Routes
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, phone, password, role } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ username, email, phone, role });
    await User.register(user, password);

    res
      .status(201)
      .json({ success: true, message: "Registration successful!" });
  } catch (err) {
    console.error("Registration error:", err);
    res
      .status(500)
      .json({ success: false, message: "Registration failed: " + err.message });
  }
});

app.post("/api/login", (req, res, next) => {
  passport.authenticate("user-local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Authentication error" });
    }

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: info?.message || "Invalid credentials",
        });
    }

    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Login failed" });
      }

      const welcomeMessage =
        user.role === "student"
          ? "Welcome student! Access granted to student portal."
          : user.role === "faculty"
          ? "Welcome professor! Access granted to faculty dashboard."
          : "Welcome admin! Access granted to admin dashboard.";

      res.json({
        success: true,
        message: "Login successful!",
        welcomeMessage,
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    });
  })(req, res, next);
});

app.post("/api/admin/register", async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const admin = new User({ username, email, phone, role: "admin" });
    await User.register(admin, password);

    res
      .status(201)
      .json({ success: true, message: "Admin registration successful!" });
  } catch (err) {
    console.error("Admin Registration error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Admin registration failed: " + err.message,
      });
  }
});

app.post("/api/admin/login", (req, res, next) => {
  passport.authenticate("user-local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Authentication error" });
    }

    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: info?.message || "Invalid credentials",
        });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admin only." });
    }

    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Login failed" });
      }

      res.json({
        success: true,
        message: "Admin login successful!",
        admin: {
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    });
  })(req, res, next);
});

app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.json({ success: true, message: "Logout successful!" });
  });
});

app.get("/api/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } else {
    res.json({ authenticated: false });
  }
});

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ success: false, message: "Access denied. Admin only." });
}

// Admin-only route
app.get("/api/admin/dashboard", isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the admin dashboard",
    admin: {
      username: req.user.username,
      email: req.user.email,
    },
  });
});

// Notice Routes
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
    res
      .status(500)
      .json({ success: false, message: "Failed to create notice." });
  }
});

app.put("/api/admin/post/:id", async (req, res) => {
  try {
    const { title, description, image, video, category, branch } = req.body;
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image,
        video,
        category,
        branch,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedNotice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found." });
    }

    res.json({
      success: true,
      message: "Notice updated successfully!",
      notice: updatedNotice,
    });
  } catch (err) {
    console.error("Error updating notice:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update notice." });
  }
});

app.delete("/api/admin/post/:id", async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndDelete(req.params.id);

    if (!deletedNotice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found." });
    }

    res.json({ success: true, message: "Notice deleted successfully!" });
  } catch (err) {
    console.error("Error deleting notice:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete notice." });
  }
});

app.get("/api/notices", async (req, res) => {
  try {
    const notices = await Notice.find().populate("createdBy", "username email");
    res.json({ success: true, notices });
  } catch (err) {
    console.error("Error fetching notices:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notices." });
  }
});

app.get("/api/notices/:id", async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );
    if (!notice) {
      return res
        .status(404)
        .json({ success: false, message: "Notice not found." });
    }
    res.json({ success: true, notice });
  } catch (err) {
    console.error("Error fetching notice:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notice." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
