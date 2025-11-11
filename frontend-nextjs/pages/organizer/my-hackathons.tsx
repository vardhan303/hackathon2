import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import api from "@/lib/axios";
import { AuthContext } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Hackathon {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  maxTeams: number;
  registrationStats?: {
    total: number;
    approved: number;
    pending: number;
    maxTeams: number;
    isFull: boolean;
    spotsLeft: number;
  };
}

interface Registration {
  _id: string;
  userId: {
    name: string;
    email: string;
    phone: string;
    registrationNumber: string;
  };
  registrationNumber: string;
  teamSize: number;
  teammates: Array<{
    name: string;
    registrationNumber: string;
    email: string;
  }>;
  status: string;
  registeredAt: string;
}

interface RegistrationStats {
  total: number;
  approved: number;
  pending: number;
  maxTeams: number;
  isFull: boolean;
  spotsLeft: number;
}

export default function MyHackathons() {
  const { user } = useContext(AuthContext);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationStats, setRegistrationStats] = useState<RegistrationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMyHackathons();
  }, []);

  const fetchMyHackathons = async () => {
    try {
      const res = await api.get("/hackathons");
      // Filter hackathons created by this organizer
      const myHackathons = res.data.filter(
        (h: any) => h.organizerEmail === user?.email
      );
      setHackathons(myHackathons);
    } catch (err) {
      console.error("Error fetching hackathons:", err);
    }
  };

  const fetchRegistrations = async (hackathonId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/hackathons/${hackathonId}/registrations`);
      setRegistrations(res.data.registrations || res.data);
      setRegistrationStats(res.data.stats || null);
      setSelectedHackathon(hackathonId);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      alert("Failed to fetch registrations");
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = async (registrationId: string, status: string) => {
    try {
      await api.put(`/hackathons/registration/${registrationId}/status`, { status });
      alert(`Registration ${status}!`);
      // Refresh registrations
      if (selectedHackathon) {
        fetchRegistrations(selectedHackathon);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update registration status");
    }
  };

  const toggleHackathonStatus = async (hackathonId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'open' ? 'closed' : 'open';
      await api.put(`/hackathons/${hackathonId}/status`, { status: newStatus });
      alert(`Hackathon ${newStatus}!`);
      fetchMyHackathons();
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update hackathon status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="card p-8 mb-8 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Organizer Dashboard 📋
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your hackathons and view team registrations</p>
              </div>
              <button
                onClick={() => router.push("/create")}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create New Hackathon
              </button>
            </div>
          </div>

          {/* My Hackathons */}
          <div className="card p-6 mb-8 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                My Hackathons ({hackathons.length})
              </h2>
            </div>

            {hackathons.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                  You haven't created any hackathons yet.
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  Click "Create New Hackathon" to get started!
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {hackathons.map((hackathon) => (
                  <div
                    key={hackathon._id}
                    className="border-2 border-gray-200 dark:border-gray-700 p-6 rounded-xl hover:shadow-2xl hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {hackathon.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {hackathon.description}
                        </p>
                        <div className="flex gap-4 mt-3 text-sm items-center flex-wrap">
                          <span className={`px-2 py-1 rounded ${getStatusColor(hackathon.status)}`}>
                            {hackathon.status.toUpperCase()}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            📅 Starts: {new Date(hackathon.startDate).toLocaleDateString()}
                          </span>
                          {hackathon.registrationStats && (
                            <>
                              <span className={`px-3 py-1 rounded-lg font-semibold ${
                                hackathon.registrationStats.isFull 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                👥 {hackathon.registrationStats.approved}/{hackathon.registrationStats.maxTeams} Teams
                              </span>
                              {hackathon.registrationStats.isFull && (
                                <span className="px-3 py-1 rounded-lg bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 font-semibold">
                                  🚫 FULL
                                </span>
                              )}
                              {hackathon.registrationStats.pending > 0 && (
                                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-semibold">
                                  ⏳ {hackathon.registrationStats.pending} Pending
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleHackathonStatus(hackathon._id, hackathon.status)}
                          className={`px-4 py-2 rounded-lg font-semibold text-white ${
                            hackathon.status === 'open' 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {hackathon.status === 'open' ? 'Close Registration' : 'Open Registration'}
                        </button>
                        <button
                          onClick={() => fetchRegistrations(hackathon._id)}
                          className="btn-primary"
                        >
                          View Registrations
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedHackathon && (
            <div className="card p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Team Registrations
                    </h2>
                    {registrationStats && (
                      <div className="flex gap-3 mt-1 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          ✅ Approved: <span className="font-bold text-green-600">{registrationStats.approved}</span>
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ⏳ Pending: <span className="font-bold text-yellow-600">{registrationStats.pending}</span>
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          📊 Total: <span className="font-bold">{registrationStats.total}</span>/{registrationStats.maxTeams}
                        </span>
                        {registrationStats.isFull ? (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 font-semibold text-xs">
                            🚫 CAPACITY FULL
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 font-semibold text-xs">
                            ✅ {registrationStats.spotsLeft} Spots Left
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => { setSelectedHackathon(null); setRegistrations([]); setRegistrationStats(null); }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  ← Back
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No registrations yet
                </div>
              ) : (
                <div className="space-y-4">
                  {registrations.map((reg) => (
                    <div
                      key={reg._id}
                      className="border-2 border-gray-200 dark:border-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg">{reg.userId.name}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(reg.status)}`}>
                              {reg.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Registration #: {reg.registrationNumber}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Email: {reg.userId.email} | Phone: {reg.userId.phone}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Team Size: {reg.teamSize} members
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Registered: {new Date(reg.registeredAt).toLocaleString()}
                          </p>

                          {reg.teammates && reg.teammates.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                              <p className="text-sm font-semibold mb-2">Teammates:</p>
                              {reg.teammates.map((teammate, idx) => (
                                <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 ml-4">
                                  {idx + 1}. {teammate.name} | Reg#: {teammate.registrationNumber} | {teammate.email}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {reg.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateRegistrationStatus(reg._id, 'approved')}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateRegistrationStatus(reg._id, 'rejected')}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
