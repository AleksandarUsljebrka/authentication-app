import "./App.css";
import "tailwindcss/tailwind.css";
import Navbar from "./components/Navbar";
import LoginUser from "./pages/auth/LoginPage";
import RegisterUser from "./pages/auth/RegisterPage";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import AllUsersPage from "./pages/AllUsersPage";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import MyProfilePage from "./pages/MyProfile";
import Loading from "./components/Loading";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";

Modal.setAppElement('#root');
function App() {
  const { loadUser, isLoggedIn, user, isLoading } = useAuth();

  const isAdmin = user.role === "Admin";

  useEffect(() => {
    loadUser();
  }, [loadUser]);
  if (isLoading)
    return (
     <Loading/>
    );
  else
    return (
      <div className="bg-gray-200">
        <Navbar />
        <ToastContainer hideProgressBar={true} autoClose={2000}/>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-profile"
            element={isLoggedIn ? <MyProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!isLoggedIn ? <LoginUser /> : <Navigate to="/" />}
          />

          <Route
            path="/verify-email"
            element={!isLoggedIn ? <VerifyEmailPage /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!isLoggedIn ? <RegisterUser /> : <Navigate to="/" />}
          />

          <Route
            path="/all-users"
            element={
              isLoggedIn ? (
                isAdmin ? (
                  <AllUsersPage />
                ) : (
                  <HomePage />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    );
}

export default App;
