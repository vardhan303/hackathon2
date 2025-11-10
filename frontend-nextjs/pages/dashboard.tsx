import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import api from "@/lib/axios";
import { AuthContext } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatDate";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Hackathon {
  _id: string;
  name: string;
  description: string;
  theme?: string;
  startDate: string;
  endDate: string;
  locationType: string;
  venue?: string;
  maxTeamSize: number;
  maxTeams: number;
  status?: string;
}

interface Registration {
  _id: string;
  hackathonId: string;
  registrationNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  teamSize: number;
}

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [userApproved, setUserApproved] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeringFor, setRegisteringFor] = useState<string | null>(null);
  const [teamSize, setTeamSize] = useState(1);
  const [teammates, setTeammates] = useState([{ name: "", email: "", phone: "" }]);
  const router = useRouter();

  useEffect(() => {
    fetchHackathons();
    fetchMyRegistrations();
    checkUserStatus();
  }, []);

  const fetchHackathons = async () => {
    try {
      const res = await api.get("/hackathons");
      setHackathons(res.data);
    } catch (err) {
      console.error("Error fetching hackathons:", err);
    }
  };

  const fetchMyRegistrations = async () => {
    try {
      const res = await api.get("/hackathons/my-registrations");
      setMyRegistrations(res.data);
    } catch (err) {
      console.error("Error fetching registrations:", err);
    }
  };

  const checkUserStatus = async () => {
    try {
      const res = await api.get("/auth/me");
      setUserApproved(res.data.approved);
    } catch (err) {
      console.error("Error checking user status:", err);
    }
  };

  const requestToCreateHackathon = async () => {
    if (!reason.trim()) {
      alert("Please provide a reason for your request");
      return;
    }

    setLoading(true);
    try {
      await api.post("/request/hackathon", { reason });
      setRequestStatus("pending");
      alert("Request submitted successfully! Waiting for admin approval.");
      setReason("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (hackathonId: string) => {
    try {
      const response = await api.post("/hackathons/register", {
        hackathonId,
        teamSize,
        teammates: teammates.slice(0, teamSize - 1)
      });
      alert(`Registration successful! Your registration number is: ${response.data.registrationNumber}`);
      setRegisteringFor(null);
      setTeamSize(1);
      setTeammates([{ name: "", email: "", phone: "" }]);
      fetchMyRegistrations();
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const getRegistrationStatus = (hackathonId: string) => {
    return myRegistrations.find(r => r.hackathonId === hackathonId);
  };

  const handleTeammateChange = (index: number, field: string, value: string) => {
    const newTeammates = [...teammates];
    newTeammates[index] = { ...newTeammates[index], [field]: value };
    setTeammates(newTeammates);
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="card p-8 mb-8 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Welcome back, {user?.name || "User"}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Here's what's happening with your hackathons</p>
              </div>
              <div className="text-6xl animate-bounce">🚀</div>
            </div>
          </div>

          {/* User/Organizer Section */}
          {user?.role === "user" && (
            <div className="card p-6 mb-8 animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {userApproved ? "Organizer Dashboard" : "Become an Organizer"}
                </h2>
              </div>
              
              {!userApproved && requestStatus !== "pending" ? (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-700">
                  <p className="mb-4 text-gray-700 dark:text-gray-300 font-medium">
                    You need admin approval to create hackathons. Submit a request below:
                  </p>
                  <textarea
                    className="input w-full mb-4 h-24"
                    placeholder="Tell us why you want to create hackathons..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <button
                    onClick={requestToCreateHackathon}
                    className="btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Request to Create Hackathon"}
                  </button>
                </div>
              ) : requestStatus === "pending" ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-yellow-800 dark:text-yellow-200 font-medium">Your request is pending admin approval.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded-lg mb-4">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-green-800 dark:text-green-200 font-medium">✅ You are approved to create hackathons!</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => router.push("/create")}
                      className="btn-primary"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Create Hackathon
                      </span>
                    </button>
                    <button
                      onClick={() => router.push("/organizer/my-hackathons")}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        My Hackathons & Teams
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Judge Section */}
          {user?.role === "judge" && (
            <div className="card p-6 mb-8 animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Judge Actions</h2>
              </div>
              <button
                onClick={() => router.push("/judge")}
                className="btn-primary w-full"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  View Available Hackathons
                </span>
              </button>
            </div>
          )}

          {/* Admin Section */}
          {user?.role === "admin" && (
            <div className="card p-6 mb-8 animate-slide-up bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Admin Controls</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => router.push("/admin")}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Approval Panel
                  </span>
                </button>
                <button
                  onClick={() => router.push("/admin/management")}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    User Management
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* All Hackathons */}
          <div className="card p-6 mb-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Available Hackathons ({hackathons.length})</h2>
            </div>
            
            {hackathons.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No hackathons available yet.</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Check back later for exciting events!</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {hackathons.map((hackathon) => (
                  <div
                    key={hackathon._id}
                    className="border-2 border-gray-200 dark:border-gray-700 p-6 rounded-xl hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {hackathon.name}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            hackathon.status === "open" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                            hackathon.status === "active" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                            hackathon.status === "closed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                          }`}>
                            {hackathon.status?.toUpperCase() || "DRAFT"}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{hackathon.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {hackathon.theme && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                              </svg>
                              <span><strong>Theme:</strong> {hackathon.theme}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <span><strong>Start:</strong> {new Date(hackathon.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span><strong>Location:</strong> {hackathon.locationType === "online" ? "Online" : hackathon.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            <span><strong>Team:</strong> {hackathon.maxTeamSize} members</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Registration Section */}
                      <div className="mt-4 pt-4 border-t dark:border-gray-700">
                        {(() => {
                          const registration = getRegistrationStatus(hackathon._id);
                          
                          if (registration) {
                            return (
                              <div className={`px-4 py-3 rounded-lg ${
                                registration.status === 'approved' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
                                registration.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
                                'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-semibold">
                                      Registration #{registration.registrationNumber}
                                    </p>
                                    <p className="text-xs mt-1">
                                      Status: <span className="font-bold capitalize">{registration.status}</span>
                                    </p>
                                  </div>
                                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    registration.status === 'approved' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' :
                                    registration.status === 'rejected' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                                    'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                                  }`}>
                                    {registration.status === 'approved' ? '✓ Approved' :
                                     registration.status === 'rejected' ? '✗ Rejected' :
                                     '⏳ Pending'}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          
                          if (registeringFor === hackathon._id) {
                            return (
                              <div className="space-y-3 animate-fade-in">
                                <div>
                                  <label className="block text-sm font-semibold mb-2">Team Size</label>
                                  <input
                                    type="number"
                                    min="1"
                                    max={hackathon.maxTeamSize}
                                    value={teamSize}
                                    onChange={(e) => {
                                      const size = parseInt(e.target.value) || 1;
                                      setTeamSize(size);
                                      const newTeammates = Array.from({ length: Math.max(0, size - 1) }, (_, i) => 
                                        teammates[i] || { name: "", email: "", phone: "" }
                                      );
                                      setTeammates(newTeammates);
                                    }}
                                    className="input w-full"
                                  />
                                </div>
                                
                                {teamSize > 1 && (
                                  <div className="space-y-2">
                                    <p className="text-sm font-semibold">Teammate Details ({teamSize - 1} teammate{teamSize > 2 ? 's' : ''})</p>
                                    {teammates.slice(0, teamSize - 1).map((teammate, index) => (
                                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded space-y-2">
                                        <p className="text-xs font-semibold">Teammate {index + 1}</p>
                                        <input
                                          type="text"
                                          placeholder="Name"
                                          value={teammate.name}
                                          onChange={(e) => handleTeammateChange(index, 'name', e.target.value)}
                                          className="input w-full text-sm"
                                        />
                                        <input
                                          type="email"
                                          placeholder="Email"
                                          value={teammate.email}
                                          onChange={(e) => handleTeammateChange(index, 'email', e.target.value)}
                                          className="input w-full text-sm"
                                        />
                                        <input
                                          type="tel"
                                          placeholder="Phone"
                                          value={teammate.phone}
                                          onChange={(e) => handleTeammateChange(index, 'phone', e.target.value)}
                                          className="input w-full text-sm"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleRegister(hackathon._id)}
                                    className="btn-primary flex-1"
                                  >
                                    Confirm Registration
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRegisteringFor(null);
                                      setTeamSize(1);
                                      setTeammates([{ name: "", email: "", phone: "" }]);
                                    }}
                                    className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            );
                          }
                          
                          return (
                            <button
                              onClick={() => setRegisteringFor(hackathon._id)}
                              className="btn-primary w-full"
                              disabled={hackathon.status !== 'open'}
                            >
                              {hackathon.status === 'open' ? 'Register Now' : 'Registration Closed'}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Registrations Section - Show for regular users */}
          {user?.role === "user" && myRegistrations.length > 0 && (
            <div className="card p-6 mb-8 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Registrations ({myRegistrations.length})</h2>
              </div>

              <div className="grid gap-4">
                {myRegistrations.map((reg) => {
                  const hackathon = hackathons.find(h => h._id === reg.hackathonId);
                  return (
                    <div
                      key={reg._id}
                      className="border-2 border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {hackathon?.name || 'Hackathon'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Registration #: <span className="font-mono font-semibold">{reg.registrationNumber}</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Team Size: {reg.teamSize} members
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
                          reg.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          reg.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {reg.status === 'approved' ? '✓ Approved' :
                           reg.status === 'rejected' ? '✗ Rejected' :
                           '⏳ Pending'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}