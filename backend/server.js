if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local");
const User = require("./models/user_model");

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust to your client app's URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
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

// Initialize Passport and manage sessions
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MongoDB connection
const dbUrl = process.env.ATLAS_DB_URI;
mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Failed to connect to DB:", err));

// Routes
app.get("/api/", (req, res) => {
  res.send("Hello World!");
});

// Register route
app.post("/api/register", async (req, res) => {
  const { username, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = new User({ username, email, phone });
    await User.register(user, password); // Hashes password and saves user

    res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login route
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Authentication error" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ message: info?.message || "Invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }

      return res.json({
        message: "Login successful!",
        user: {
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

// Logout route
app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logout successful!" });
  });
});

// Check if user is authenticated
app.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
