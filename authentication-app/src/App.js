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
function App() {
  const { loadUser, isLoggedIn, user, isLoading } = useAuth();

  const isAdmin = user.role === "Admin";

  useEffect(() => {
    loadUser();
  }, [loadUser]);
  console.log(isAdmin);
  if (isLoading)
    return (
      <div className="text-3xl text-gray-900 bg-gray-200 flex items-center">
        Loading ....
      </div>
    );
  else
    return (
      <div className="bg-gray-200">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!isLoggedIn ? <LoginUser /> : <Navigate to="/" />}
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
