import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "@/lib/axios";
import Navbar from "@/components/Navbar";

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
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
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
      setTimeout(() => router.push("/"), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full">
          <div className="card p-8 animate-slide-up">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-bounce">🚀</div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                Join Us Today
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Create your account to get started</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 animate-fade-in">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6 animate-fade-in">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="input w-full"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="input w-full"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="input w-full"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="input w-full"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Register as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'user' })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.role === 'user'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">👤</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">User / Organizer</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'judge' })}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.role === 'judge'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">⚖️</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">Judge</div>
                    </div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}