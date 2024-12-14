import { createBrowserRouter,RouterProvider } from "react-router-dom";

import RegisterStudent from './components/students/RegisterStudent.jsx';
import LoginStudent from './components/students/LoginStudent.jsx';
import RegisterFaculty from './components/faculty/RegisterFaculty.jsx';
import LoginFaculty from './components/faculty/LoginFaculty.jsx';
import RegisterAdmin from './components/admin/RegisterAdmin.jsx';
import LoginAdmin from './components/admin/LoginAdmin.jsx';

import StudentDashboard from './components/students/StudentDashboard.jsx';
import StudentNotificationDetails from './components/students/StudentNotificationDetails.jsx';

import FacultyDashboard from "./components/faculty/FacultyDashboard.jsx";
import FacultyNotificationDetails from "./components/faculty/FacultyNotificationDetails.jsx";

import AdminDashboard from "./components/admin/AdminDashboard";
import NoticeForm from "./components/admin/NoticeForm.jsx"; 

import ChatBot from "./components/ChatBot.jsx";

import LandingPage from "./LandingPage.jsx";
import LandingPageLogin from "./LandingPageLogin.jsx";
import LandingPageRegister from './LandingPageRegister.jsx';

export default function App() {
  const router = createBrowserRouter([
    {
      path : "/",
      element : <LandingPage />
    },
    {
      path : "/landinglogin",
      element : <LandingPageLogin />
    },
    {
      path : "/landingregister",
      element : <LandingPageRegister />
    },
    {
      path : "/student/register",
      element : <RegisterStudent />
    },
    {
      path : "/student/login",
      element : <LoginStudent />
    },
    {
      path : "/student/dashboard/:msg",
      element : <StudentDashboard />
    },
    {
      path : "/student/dashboard/notification/:id", 
      element : <StudentNotificationDetails />
    },
    {
      path : "/faculty/register",
      element : <RegisterFaculty />
    },
    {
      path : "/faculty/login",
      element : <LoginFaculty />
    },
    {
      path : "/faculty/dashboard/:msg",
      element : <FacultyDashboard />
    },
    {
      path : "/faculty/dashboard/notification/:id", 
      element : <FacultyNotificationDetails />
    },
    {
      path : "/admin/register",
      element : <RegisterAdmin />
    },
    {
      path : "/admin/login",
      element : <LoginAdmin />
    },
    {
      path : "/admin/dashboard/:msg",
      element : <AdminDashboard />
    },
    {
      path : "/admin/dashboard/notice",
      element : <NoticeForm />
    },
    {
      path : "/chatbot",
      element : <ChatBot />
    }
  ])

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}
