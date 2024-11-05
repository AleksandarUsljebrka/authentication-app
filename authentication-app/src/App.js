import "./App.css";
import "tailwindcss/tailwind.css";
import Navbar from "./components/Navbar";
import LoginUser from "./pages/auth/LoginPage";
import RegisterUser from "./pages/auth/RegisterPage";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="bg-gray-200">
      <Navbar />

      <Routes>
        <Route path="/login" element={<LoginUser />} />

        <Route path="/register" element={<RegisterUser />} />
      </Routes>
    </div>
  );
}

export default App;
