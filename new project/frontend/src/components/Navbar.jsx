import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          🧱 Hackathon Platform
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              {user.role === "admin" && (
                <>
                  <Link to="/admin" className="hover:underline">
                    Admin Panel
                  </Link>
                  <Link to="/admin/management" className="hover:underline">
                    User & Hackathon Management
                  </Link>
                </>
              )}
              {user.role === "user" && (
                <Link to="/create" className="hover:underline">
                  Create Hackathon
                </Link>
              )}
              {user.role === "judge" && (
                <Link to="/judge" className="hover:underline">
                  Judge Requests
                </Link>
              )}
              <span className="text-sm">({user.role})</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}