import { useState } from "react";
import { useRouter } from "next/router";
import api from "@/lib/axios";
import HackathonForm from "@/components/HackathonForm";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CreateHackathon() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      await api.post("/hackathons", formData);
      alert("Hackathon created successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create hackathon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute role="user">
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="card p-8 mb-8 animate-slide-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Create New Hackathon
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Fill in the details to launch your hackathon event</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mt-6">
              <div className="flex-1 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Step 1 of 1</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="card p-8 animate-slide-up">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-xl font-semibold mt-4 text-gray-900 dark:text-white">Creating your hackathon...</p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Please wait while we set things up</p>
              </div>
            ) : (
              <div>
                {/* Info Banner */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-4 mb-6 rounded-lg">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">Quick Tips</p>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                        Make sure to provide clear and detailed information about your hackathon. All fields marked with * are required.
                      </p>
                    </div>
                  </div>
                </div>

                <HackathonForm onSubmit={handleSubmit} />
              </div>
            )}
          </div>

          {/* Help Section */}
          <div className="card p-6 mt-6 animate-slide-up border border-purple-200 dark:border-purple-700">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If you have any questions about creating a hackathon, feel free to reach out to our support team or check our documentation for guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}