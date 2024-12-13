import { BrowserRouter } from "react-router-dom";
import { createBrowserRouter,RouterProvider } from "react-router-dom"

import RegisterStudent from './components/students/RegisterStudent.jsx'
import LoginStudent from './components/students/LoginStudent.jsx'
import RegisterFaculty from './components/faculty/RegisterFaculty.jsx'
import LoginFaculty from './components/faculty/LoginFaculty.jsx'
import RegisterAdmin from './components/admin/RegisterAdmin.jsx'
import LoginAdmin from './components/admin/LoginAdmin.jsx'

import LandingPage from "./LandingPage.jsx";
import LandingPageLogin from "./LandingPageLogin.jsx";
import LandingPageRegister from './LandingPageRegister.jsx'


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
      path : "/faculty/register",
      element : <RegisterFaculty />
    },
    {
      path : "/faculty/login",
      element : <LoginFaculty />
    },
    {
      path : "/admin/register",
      element : <RegisterAdmin />
    },
    {
      path : "/admin/login",
      element : <LoginAdmin />
    },
  ])

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}
