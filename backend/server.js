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
const jwt = require("jsonwebtoken");
const getUserIdByUsername = require("./utils/getUserIdByUsername");
const sendEmail = require("./mail");

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

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ success: false, message: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user to request object
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
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

    // Generate JWT token
    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); // Token expires in 1 hour

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token, // Send the token in the response
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

      // Create JWT token
      const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      }); // Token expires in 1 hour

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
        token, // Send the token in the response
      });
    });
  })(req, res, next);
});

// Student Routes
app.get(
  "/api/student/:branch/notices",
  verifyToken,
  isStudent,
  async (req, res) => {
    try {
      const { branch } = req.params;
      const notices = await Notice.find({
        $or: [{ branch: "all" }, { branch: branch }, { category: "all" }],
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
  }
);

// Faculty Routes
app.get(
  "/api/faculty/:branch/notices",
  verifyToken,
  isFaculty,
  async (req, res) => {
    try {
      const { branch } = req.params;
      const notices = await Notice.find({
        $or: [{ branch: "all" }, { branch: branch }, { category: "all" }],
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
  }
);

// Admin Routes
// Admin Registration API
app.post("/api/admin/register", async (req, res) => {
  try {
    const { username, email, phone, password, branch } = req.body;

    // Check if the email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create and register admin user
    const admin = new User({
      username,
      email,
      phone,
      role: "admin", // Set role to 'admin'
      branch,
    });

    await User.register(admin, password);

    // Generate JWT Token
    const payload = {
      userId: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "Admin registration successful!",
      token, // Send the token
      admin: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
        branch: admin.branch,
      },
    });
  } catch (err) {
    console.error("Admin registration error:", err);
    res.status(500).json({
      success: false,
      message: "Admin registration failed: " + err.message,
    });
  }
});

// Admin Login API
app.post("/api/admin/login", (req, res, next) => {
  passport.authenticate("user-local", (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Authentication error",
      });
    }
    if (!user || user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid credentials or not an admin",
      });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Login failed",
        });
      }

      // Generate JWT token
      const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({
        success: true,
        message: "Admin login successful!",
        token, // Send the token
        admin: {
          username: user.username,
          email: user.email,
          role: user.role,
          branch: user.branch,
        },
      });
    });
  })(req, res, next);
});

// Admin Routes (Creating Notices)
app.post("/api/admin/post", async (req, res) => {
  try {
    const { username, title, description, category, branch } = req.body;

    // Fetch the user ID based on username
    const createdBy = await getUserIdByUsername(username);

    // Proceed with creating the notice
    const newNotice = new Notice({
      title,
      description,
      category: category || "all",
      branch: branch || "all",
      createdBy,
    });

    await newNotice.save();

    // Send email notifications
    await sendEmailNotification(newNotice); // Notify users about the new notice

    res.status(201).json({
      success: true,
      message: "Notice created successfully!",
      notice: newNotice,
    });
  } catch (err) {
    console.error("Error creating notice:", err);
    res.status(500).json({
      success: false,
      message: `Failed to create notice. Error: ${err.message}`,
    });
  }
});
// Function to send email notifications to relevant users (Your existing function)
const sendEmailNotification = async (notice) => {
  try {
    // Fetch users who should be notified based on the notice's branch or category
    const usersToNotify = await User.find({
      $or: [{ branch: notice.branch }, { category: notice.category }],
    });

    // Send an email to each user
    for (let user of usersToNotify) {
      // Send an email with the notice details
      const emailSubject = `New Notice: ${notice.title}`;
      const emailText = `Hello ${user.username},\n\nA new notice has been posted:\n\nTitle: ${notice.title}\nDescription: ${notice.description}\n\nKind regards,\nYour Admin`;

      // Use the sendEmail function from emailSender.js
      await sendEmail(user.email, emailSubject, emailText);
    }
  } catch (err) {
    console.error("Error sending email notifications:", err);
  }
};

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
