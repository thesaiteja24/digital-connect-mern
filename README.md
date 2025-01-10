## **⚠️ Important Notice:**  
Due to some issues, the frontend and backend connectivity is not integrated properly. I am working on it and will fix it soon.

---

# Digital Connect: A Smart Notification System

**Digital Connect** is a cutting-edge notification platform designed to deliver instant updates to users in an efficient and streamlined manner. This platform is built collaboratively by Shanwaz, Saritha, Sai Teja, and Manideep as part of a hackathon project.

---

## 🚀 Features

### User Authentication:

- Secure login and registration functionality to ensure only authorized access.

### Instant Notifications:

- Real-time delivery of updates and notifications.

### User-Friendly Dashboard:

- Intuitive interface to view and manage notifications efficiently.

### Cross-Platform Access:

- Built with a responsive design, accessible across devices.

---

## 🛠️ Tech Stack

### Frontend:

- **React** with **Vite** for fast development and performance.
- **CSS** and **Bootstrap** for styling.

### Backend:

- **Node.js** with **Express** for robust server-side operations.
- **MongoDB** for secure and scalable database storage.

### Libraries:

- **Mongoose** for database interactions.
- **Cloudinary**  for hosting images and videos
- **React Router** for navigation.

---

## 📂 Project Structure

```
notice-board-hackathon/
├── backend/              # Backend files
│   ├── controllers/      # Business logic
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── server.js         # Entry point for the backend
├── frontend/             # Frontend files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page-level components
│   │   ├── App.jsx       # Main application file
│   │   ├── index.css     # Global styles
│   │   ├── main.jsx      # React entry point
├── .env.example          # Example environment variables
└── README.md             # Project documentation
```

---

## 🔧 Installation

### Prerequisites:

- Node.js and npm installed on your system.
- MongoDB instance for the database.

### Steps to Set Up:

#### 1. Clone the Repository:

```bash
git clone https://github.com/thesaiteja24/notice-board-hackathon.git
cd notice-board-hackathon
```

#### 2. Backend Setup:

```bash
cd backend
npm install
```

- Rename `.env.example` to `.env` and configure the following variables:
  ```
  MONGO_URI=your-mongodb-connection-string
  JWT_SECRET=your-secret-key
  ```
- Start the backend server:
  ```bash
  node server.js
  ```

#### 3. Frontend Setup:

```bash
cd ../frontend
npm install
npm run dev
```

#### 4. Access the Application:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

---

## 📝 Usage

### Logging In:

1. Navigate to the login page.
2. Enter your credentials to gain access to your dashboard.

### Managing Notifications:

1. Create new notifications using the dashboard tools.
2. View all notifications in an organized format.

---

## 📜 License

This project is licensed under the MIT License.

---

## 📬 Contact

For any questions or feedback, feel free to reach out:

- **Shanwaz**
- **Saritha**
- **Sai Teja**GitHub: [thesaiteja24](https://github.com/thesaiteja24)
- **Manideep**

---

## 🙌 Acknowledgments

- MERN Stack Documentation
- Hackathon organizers for the opportunity to build this project.
- The collaborative efforts of the Digital Connect team.
