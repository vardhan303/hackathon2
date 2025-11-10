import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "@/lib/axios";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      
      // Check if user is admin
      if (res.data.role !== 'admin') {
        setError("Access denied. This page is for administrators only.");
        setLoading(false);
        return;
      }

      login(res.data.token, res.data.role, {
        name: res.data.name,
        email: res.data.email,
        _id: res.data._id
      });
      router.push("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-lg bg-white">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">👨‍💼</div>
          <h1 className="text-3xl font-bold text-red-600">Admin Login</h1>
          <p className="text-sm text-gray-600 mt-2">System Administrator Access Only</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Default Credentials Info */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <p className="text-sm font-semibold text-blue-800 mb-2">Default Admin Credentials:</p>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Email:</strong> admin@hackathon.com</p>
            <p><strong>Password:</strong> admin123</p>
          </div>
          <p className="text-xs text-blue-600 mt-2 italic">
            (Change these credentials after first login)
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Admin Email</label>
            <input
              type="email"
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Admin Password</label>
            <input
              type="password"
              className="border p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-3 rounded w-full hover:bg-red-700 font-medium disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Admin Login"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-gray-600">
            Not an admin?{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              User Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}