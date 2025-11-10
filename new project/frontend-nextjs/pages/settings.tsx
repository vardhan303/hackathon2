import { useState, useContext } from "react";
import { useRouter } from "next/router";
import api from "@/lib/axios";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      await api.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="card p-8 mb-8 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Account Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account preferences and security</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Profile Info Card */}
            <div className="card p-6 animate-slide-up">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-white font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {user?.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {user?.email}
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  user?.role === "admin" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                  user?.role === "judge" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                }`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  {user?.role === "user" && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{user?.approved ? "Approved Organizer" : "Pending Approval"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="md:col-span-2 card p-8 animate-slide-up">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Change Password
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep your account secure by updating your password regularly
                </p>
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

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    className="input w-full"
                    placeholder="Enter your current password"
                    value={passwordData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    New Password *
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    className="input w-full"
                    placeholder="Enter your new password (min. 6 characters)"
                    value={passwordData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="input w-full"
                    placeholder="Confirm your new password"
                    value={passwordData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Password Requirements:</p>
                      <ul className="text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Minimum 6 characters long</li>
                        <li>• Use a strong, unique password</li>
                        <li>• Don't reuse passwords from other accounts</li>
                      </ul>
                    </div>
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
                      Updating Password...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Update Password
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}