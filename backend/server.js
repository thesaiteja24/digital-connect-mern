// Environment Configuration
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Dependencies
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local").Strategy;

// Models
const User = require("./models/user_model");
const Notice = require("./models/notice_model");

// App initialization
const app = express();
const port = process.env.PORT || 8080;

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "thisshouldbeasecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.ATLAS_DB_URI }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "user-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    User.authenticate()
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Database Connection
mongoose
  .connect(process.env.ATLAS_DB_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Failed to connect to DB:", err));

// Middleware Functions
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: "Authentication required",
  });
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Admin only.",
  });
};

const isStudent = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "student") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Students only.",
  });
};

const isFaculty = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "faculty") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Faculty only.",
  });
};

// Authentication Routes
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, phone, password, role, branch } = req.body;
    
    // Check for existing username and email
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }
    
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    // Create and register user
    const user = new User({ username, email, phone, role, branch });
    await User.register(user, password);
    
    res.status(201).json({
      success: true,
      message: "Registration successful!",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: "Registration failed: " + err.message,
    });
  }
});

app.post("/api/login", (req, res, next) => {
  passport.authenticate("user-local", (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Authentication error",
      });
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid credentials",
      });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Login failed",
        });
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
          branch: user.branch,
        },
      });
    });
  })(req, res, next);
});

// Student Routes
app.get("/api/student/:branch/notices", isStudent, async (req, res) => {
  try {
    const { branch } = req.params;
    const notices = await Notice.find({
      $or: [
        { branch: "all" },
        { branch: branch },
        { category: "all" }
      ]
    }).populate("createdBy", "username email");
    
    res.json({
      success: true,
      notices,
    });
  } catch (err) {
    console.error("Error fetching student notices:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notices.",
    });
  }
});

// Faculty Routes
app.get("/api/faculty/:branch/notices", isFaculty, async (req, res) => {
  try {
    const { branch } = req.params;
    const notices = await Notice.find({
      $or: [
        { branch: "all" },
        { branch: branch },
        { category: "all" }
      ]
    }).populate("createdBy", "username email");
    
    res.json({
      success: true,
      notices,
    });
  } catch (err) {
    console.error("Error fetching faculty notices:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notices.",
    });
  }
});

// Notice Routes
// Public Routes
app.get("/api/notices", async (req, res) => {
  try {
    const notices = await Notice.find({
      category: "all",
      branch: "all"
    }).populate("createdBy", "username email");
    res.json({ success: true, notices });
  } catch (err) {
    console.error("Error fetching notices:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notices." });
  }
});

app.get("/api/notices/:id", async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );
    if (!notice) {
      return res.status(404).json({ success: false, message: "Notice not found." });
    }
    res.json({ success: true, notice });
  } catch (err) {
    console.error("Error fetching notice:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notice." });
  }
});

// Admin Routes
app.post("/api/admin/post", isAdmin, async (req, res) => {
  try {
    const { title, description, image, video, category, branch } = req.body;
    const createdBy = req.user._id;
    
    const newNotice = new Notice({
      title,
      description,
      image,
      video,
      category: category || "all",
      branch: branch || "all",
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

app.put("/api/admin/post/:id", isAdmin, async (req, res) => {
  try {
    const { title, description, image, video, category, branch } = req.body;
    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        image,
        video,
        category: category || "all",
        branch: branch || "all",
        updatedAt: Date.now(),
      },
      { new: true }
    );
    
    if (!updatedNotice) {
      return res.status(404).json({ success: false, message: "Notice not found." });
    }
    
    res.json({
      success: true,
      message: "Notice updated successfully!",
      notice: updatedNotice,
    });
  } catch (err) {
    console.error("Error updating notice:", err);
    res.status(500).json({ success: false, message: "Failed to update notice." });
  }
});

app.delete("/api/admin/post/:id", isAdmin, async (req, res) => {
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

// Server Startup
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});