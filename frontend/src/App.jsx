import { BrowserRouter } from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
// import RegisterStudent from './components/students/RegisterStudent.jsx'
// import LoginStudent from './components/students/LoginStudent.jsx'
// import RegisterFaculty from './components/faculty/RegisterFaculty.jsx'
// import LoginFaculty from './components/faculty/LoginFaculty.jsx'
// import LoginAdmin from './components/admin/LoginAdmin.jsx'
// import RegisterAdmin from './components/admin/RegisterAdmin.jsx'


export default function App() {
  return (
    <BrowserRouter>
      <LandingPage />
      {/* <RegisterAdmin />
      <LoginAdmin /> */}
    </BrowserRouter>
  );
}
