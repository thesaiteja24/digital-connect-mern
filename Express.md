# Documentation for Express Server Code

## 1. Overview

This server application is built with **Node.js** and **Express** and serves as the backend for a system with user authentication, role-based access control, and content management. Key functionalities include handling user authentication, managing notices, and uploading files to **Cloudinary**. The database used is **MongoDB**, and additional libraries such as **Passport.js** and **Multer** are used to extend capabilities.

---

## 2. Dependencies

### Environment Configuration

- `dotenv`: Loads environment variables from a `.env` file.

### Core Libraries

- `express`: Framework for building server-side applications.
- `path`: Node.js module for working with file paths.
- `cors`: Middleware for enabling CORS (Cross-Origin Resource Sharing).
- `mongoose`: ODM library for MongoDB.

### Authentication and Sessions

- `passport`: Middleware for authentication.
- `passport-local`: Local strategy for username/password authentication.
- `passport-local-mongoose`: Simplifies user authentication with Mongoose.
- `express-session`: Middleware for session management.
- `connect-mongo`: MongoDB session store for `express-session`.

### File Handling and Storage

- `multer`: Middleware for handling file uploads.
- `cloudinary`: Cloud-based image and video management.
- `multer-storage-cloudinary`: Plugin for integrating Cloudinary with Multer.

### Miscellaneous

- `jsonwebtoken`: For creating and verifying JWT tokens.

---

## 3. App Initialization

The server initializes an Express application (`app`) and configures it to listen on a specified port (`8080` by default).

---

## 4. Cloudinary Configuration

The server is configured to use Cloudinary for managing file uploads. Cloudinary credentials are loaded from environment variables:

```javascript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

`multer-storage-cloudinary` is used to integrate Cloudinary with Multer for file uploads.

---

## 5. Middleware

### Core Middleware

- **Body Parsing**:
  - `express.json()`: Parses JSON payloads.
  - `express.urlencoded()`: Parses URL-encoded payloads.
- **CORS**: Configured to allow requests from a specific frontend origin.

### Session Management

Session data is stored in MongoDB via `connect-mongo`. Sessions are configured to be secure in production environments.

### Authentication

Passport is configured with a `LocalStrategy` for user authentication. User sessions are serialized and deserialized using methods provided by `passport-local-mongoose`.

---

## 6. Database Connection

The server connects to a MongoDB database using Mongoose. The connection string is stored in `process.env.ATLAS_DB_URI`. On successful connection, a message is logged to the console.

---

## 7. Role-Based Middleware

Role-based access control is implemented using middleware functions:

- **`isAuthenticated`**: Ensures the user is logged in.
- **`isAdmin`**: Grants access only to users with the `admin` role.
- **`isStudent`**: Grants access only to users with the `student` role.
- **`isFaculty`**: Grants access only to users with the `faculty` role.

---

## 8. Routes

### 8.1 Authentication Routes

- **Registration**:
  - `/api/register`: Allows users to register with their details and a password.
  - `/api/admin/register`: Allows admin users to register.
- **Login**:
  - `/api/login`: Logs in users based on email and password.
  - `/api/admin/login`: Logs in admin users.

### 8.2 Notice Routes

- **Create Notice**:
  - `/api/admin/post`: Allows admins to post notices, with optional file uploads (images/videos).
- **Update Notice**:
  - `/api/admin/notice/:id`: Updates an existing notice.
- **Delete Image**:
  - `/api/admin/notice/:id/image`: Deletes an image associated with a notice.
- **Fetch Notices**:
  - `/api/student/:branch/notices`: Fetches notices for students in a specific branch.
  - `/api/faculty/:branch/notices`: Fetches notices for faculty in a specific branch.

### 8.3 Utility Routes

- `/api/test/upload-image`: Demonstrates image upload to Cloudinary.

---

## 9. Utility Functions

### Email Notifications

The `sendEmailNotification` function sends email notifications to users when a notice is posted. It uses a mail-sending utility (`sendEmail`) to deliver the notifications.

### JWT Verification

The `verifyToken` middleware verifies JWT tokens provided in the `Authorization` header of incoming requests.

---

## 10. Security Measures

- **Environment Variables**: Sensitive data (e.g., database URI, Cloudinary credentials, JWT secret) are stored in environment variables.
- **Session Security**: Sessions are secured with `httpOnly` cookies and are only transmitted over HTTPS in production.
- **Password Management**: Passwords are hashed and salted using `passport-local-mongoose`.
- **Input Validation**: Routes validate user input to prevent duplicate registrations and other errors.

---

## 11. Error Handling

Error messages are logged to the console and descriptive error responses are sent to the client. Common scenarios include:

- Database connection errors.
- Validation failures (e.g., duplicate email or username).
- Authentication errors.

---

## 12. Future Enhancements

- Input validation using a library like `Joi` or `express-validator`.
- Rate limiting to prevent brute-force attacks.
- Pagination for fetching notices.
- Enhanced logging with tools like `Winston` or `Pino`.

---

## 13. Conclusion

This server provides a robust backend solution for managing user authentication, notices, and file uploads. Its modular design and use of popular libraries make it easy to extend and maintain.
