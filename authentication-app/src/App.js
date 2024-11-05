import "./App.css";
import "tailwindcss/tailwind.css";
import Navbar from "./components/Navbar";
import LoginUser from "./pages/auth/LoginPage";
import RegisterUser from "./pages/auth/RegisterPage";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
function App() {

  const {loadUser, isLoggedIn} = useAuth();

  useEffect(()=>{
    loadUser();
  },[loadUser])
  return (
    <div className="bg-gray-200">
      <Navbar />

      <Routes>
        <Route path="/" element={isLoggedIn? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={!isLoggedIn?<LoginUser />:<Navigate to="/"/>} />

        <Route path="/register" element={!isLoggedIn? <RegisterUser /> : <Navigate to="/"/>} />
      </Routes>
    </div>
  );
}

export default App;
