import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <div className="text-3xl transform group-hover:scale-110 transition-transform">
              🧱
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Hackathon Platform
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <>
                    <Link
                      href="/admin"
                      className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
                    >
                      Admin Panel
                    </Link>
                    <Link
                      href="/admin/management"
                      className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all duration-200 font-medium border border-red-300/20"
                    >
                      Management
                    </Link>
                  </>
                )}
                {user.role === "user" && (
                  <Link
                    href="/create"
                    className="px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-all duration-200 font-medium border border-green-300/20"
                  >
                    Create Hackathon
                  </Link>
                )}
                {user.role === "judge" && (
                  <Link
                    href="/judge"
                    className="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 font-medium border border-purple-300/20"
                  >
                    Judge Requests
                  </Link>
                )}
                
                {/* Settings Link */}
                <Link
                  href="/settings"
                  className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                  title="Settings"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </Link>
                
                {/* User Role Badge */}
                <span className="px-3 py-1 text-xs font-semibold bg-white/20 rounded-full">
                  {user.role.toUpperCase()}
                </span>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Register
                </Link>
                
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>

                <Link
                  href="/admin-login"
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}