import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Register</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Register as</label>
          <select
            name="role"
            className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User / Organizer</option>
            <option value="judge">Judge</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-3 rounded w-full hover:bg-blue-700 font-medium disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
}