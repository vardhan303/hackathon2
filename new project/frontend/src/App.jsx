import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminManagement from "./pages/AdminManagement";
import CreateHackathon from "./pages/CreateHackathon";
import JudgeRequests from "./pages/JudgeRequests";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin/management" element={<ProtectedRoute role="admin"><AdminManagement /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute role="user"><CreateHackathon /></ProtectedRoute>} />
          <Route path="/judge" element={<ProtectedRoute role="judge"><JudgeRequests /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}