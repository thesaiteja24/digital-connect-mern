# Server Documentation

This document provides detailed information about the server-side code for a web application. The server is built with Node.js, Express.js, and integrates with MongoDB, Cloudinary, and other services. It implements role-based authentication and authorization, file uploads, and user notifications.

---

## 1. Environment Configuration

The environment variables are loaded using `dotenv` in non-production environments:

```javascript
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
```

### Required Environment Variables:

- `PORT`
- `NODE_ENV`
- `SESSION_SECRET`
- `ATLAS_DB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## 2. Dependencies

The following key dependencies are used:

- **express**: Web framework
- **mongoose**: MongoDB object modeling tool
- **passport**: Authentication middleware
- **cloudinary**: Cloud-based media management
- **multer**: File upload handling
- **connect-mongo**: MongoDB-based session storage
- **jsonwebtoken**: JWT for secure data transfer
- **cors**: Cross-Origin Resource Sharing

---

## 3. Cloudinary Configuration

Cloudinary is configured for media storage:

```javascript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

### Multer Configuration:

Uploads are managed via Multer with Cloudinary storage:

```javascript
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const isImage = file.mimetype.startsWith("image");
    const isVideo = file.mimetype.startsWith("video");
    return {
      folder: "notices",
      allowed_formats: isImage ? ["jpg", "jpeg", "png", "gif"] : ["mp4", "avi"],
      transformation: isImage ? [{ width: 1000, height: 1000, crop: "limit" }] : [],
    };
  },
});
const upload = multer({ storage: storage });
```

---

## 4. Middleware Configuration

### CORS:

```javascript
const corsOptions = {
  origin: "https://digital-connect.onrender.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
```

### Sessions:

Sessions are managed using MongoDB for persistent storage:

```javascript
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.ATLAS_DB_URI }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);
```

---

## 5. Authentication

**Passport** is used for authentication with a local strategy:

```javascript
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
```

### Middleware Functions:

- **isAuthenticated**: Verifies if the user is logged in.
- **isAdmin**: Checks if the user has an admin role.
- **isStudent**: Checks if the user has a student role.
- **isFaculty**: Checks if the user has a faculty role.

---

## 6. Routes

### Authentication Routes:

1. **Register User:** `/api/register`
   - Creates a new user.
2. **Login User:** `/api/login`
   - Authenticates an existing user.

### Admin-Specific:

1. **Register Admin:** `/api/admin/register`
   - Creates a new admin user.
2. **Admin Login:** `/api/admin/login`
   - Authenticates an admin.

### Notice Management:

1. **Post Notice:** `/api/admin/post`
   - Uploads a notice with optional image/video.
2. **Update Notice:** `/api/admin/notice/:id`
   - Updates an existing notice.
3. **Delete Notice Image:** `/api/admin/notice/:id/image`
   - Deletes an image from a notice.
4. **Get Notices for Students:** `/api/student/:branch/notices`
5. **Get Notices for Faculty:** `/api/faculty/:branch/notices`

---

## 7. Utility Functions

### Verify JWT:

Verifies JSON Web Token for protected routes:

```javascript
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
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
```

### Email Notifications:

Sends email notifications for new notices:

```javascript
const sendEmailNotification = async (notice) => {
  const usersToNotify = await User.find({
    $or: [{ branch: notice.branch }, { category: notice.category }],
  });
  for (let user of usersToNotify) {
    const emailSubject = `New Notice: ${notice.title}`;
    const emailText = `Hello ${user.username},\n\nA new notice has been posted:\n\nTitle: ${notice.title}\nDescription: ${notice.description}\n\nKind regards,\nYour Admin`;
    await sendEmail(user.email, emailSubject, emailText);
  }
};
```

---

## 8. Error Handling

Errors are logged and appropriate HTTP status codes are returned. For example:

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});
```

---

## 9. Starting the Server

The server listens on the port specified in the environment:

```javascript
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

---

This server forms the backbone of a robust web application, supporting media uploads, role-based access, and notifications. Additional features or enhancements can be easily integrated into the existing architecture.
