// Environment Configuration
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Dependencies
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const getUserIdByUsername = require("./utils/getUserIdByUsername");
const sendEmail = require("./mail");

// Models
const User = require("./models/user_model");
const Notice = require("./models/notice_model");

// App initialization
const app = express();
const port = process.env.PORT || 8080;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer and Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const isImage = file.mimetype.startsWith("image");
    const isVideo = file.mimetype.startsWith("video");

    return {
      folder: "notices",
      allowed_formats: isImage ? ["jpg", "jpeg", "png", "gif"] : ["mp4", "avi"],
      transformation: isImage
        ? [{ width: 1000, height: 1000, crop: "limit" }]
        : [],
    };
  },
});

const upload = multer({ storage: storage });

// Middleware Configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "https://digital-connect.onrender.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // if you need to send cookies or auth headers
};
app.use(cors(corsOptions));

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
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
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

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ username, email, phone, role, branch });
    await User.register(user, password);

    const payload = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
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

      const payload = {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

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
        token,
      });
    });
  })(req, res, next);
});

// Admin Routes
app.post("/api/admin/register", async (req, res) => {
  try {
    const { username, email, phone, password, branch } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const admin = new User({
      username,
      email,
      phone,
      role: "admin",
      branch,
    });

    await User.register(admin, password);

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
      token,
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
        token,
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

// Notice Routes
app.post("/api/admin/post", upload.single("imageOrVideo"), async (req, res) => {
  try {
    const { username, title, description, category, branch } = req.body;
    let imageOrVideoUrl = null;

    if (req.file) {
      const fileType = req.file.mimetype.split("/")[0];
      if (fileType === "image") {
        imageOrVideoUrl = req.file.path;
      } else if (fileType === "video") {
        imageOrVideoUrl = req.file.path;
      }
    }

    const newNotice = new Notice({
      title,
      description,
      category: category || "all",
      branch: branch || "all",
      image:
        imageOrVideoUrl && req.file.mimetype.startsWith("image")
          ? imageOrVideoUrl
          : null,
      video:
        imageOrVideoUrl && req.file.mimetype.startsWith("video")
          ? imageOrVideoUrl
          : null,
    });

    await newNotice.save();
    await sendEmailNotification(newNotice);

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

app.put("/api/admin/notice/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, branch } = req.body;
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    if (req.file && notice.image) {
      const publicId = notice.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`notices/${publicId}`);
    }

    notice.title = title || notice.title;
    notice.description = description || notice.description;
    notice.category = category || notice.category;
    notice.branch = branch || notice.branch;
    notice.image = req.file ? req.file.path : notice.image;
    notice.updatedAt = Date.now();

    await notice.save();

    res.json({
      success: true,
      message: "Notice updated successfully",
      notice,
    });
  } catch (err) {
    console.error("Error updating notice:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update notice",
    });
  }
});

app.delete(
  "/api/admin/notice/:id/image",
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      const notice = await Notice.findById(req.params.id);

      if (!notice) {
        return res.status(404).json({
          success: false,
          message: "Notice not found",
        });
      }

      if (notice.image) {
        const publicId = notice.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`notices/${publicId}`);

        notice.image = null;
        await notice.save();
      }

      res.json({
        success: true,
        message: "Image deleted successfully",
      });
    } catch (err) {
      console.error("Error deleting image:", err);
      res.status(500).json({
        success: false,
        message: "Failed to delete image",
      });
    }
  }
);

// Get Student Notices
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

// Get Faculty Notices
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

// Email Notification Function
const sendEmailNotification = async (notice) => {
  try {
    const usersToNotify = await User.find({
      $or: [{ branch: notice.branch }, { category: notice.category }],
    });

    for (let user of usersToNotify) {
      const emailSubject = `New Notice: ${notice.title}`;
      const emailText = `Hello ${user.username},\n\nA new notice has been posted:\n\nTitle: ${notice.title}\nDescription: ${notice.description}\n\nKind regards,\nYour Admin`;

      await sendEmail(user.email, emailSubject, emailText);
    }
  } catch (err) {
    console.error("Error sending email notifications:", err);
  }
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/test/upload-image", async (req, res) => {
  try {
    // Path to the image file you want to upload
    const imagePath = path.join(__dirname, "assets", "test.jpg");

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "notices", // Uploading to 'notices' folder
      allowed_formats: ["jpg", "jpeg", "png", "gif"],
      transformation: [{ width: 1000, height: 1000, crop: "limit" }], // Optional: image transformation
    });

    // Return the URL of the uploaded image
    res.json({
      success: true,
      message: "Image uploaded successfully!",
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: err.message,
    });
  }
});
// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
