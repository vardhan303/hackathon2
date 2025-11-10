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
}

interface Registration {
  _id: string;
  userId: {
    name: string;
    email: string;
    phone: string;
  };
  registrationNumber: string;
  teamSize: number;
  teammates: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
  status: string;
  registeredAt: string;
}

export default function MyHackathons() {
  const { user } = useContext(AuthContext);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
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
      setRegistrations(res.data);
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Hackathons
              </h1>
              <button
                onClick={() => router.push("/create")}
                className="btn-primary"
              >
                Create New Hackathon
              </button>
            </div>

            {hackathons.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  You haven't created any hackathons yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {hackathons.map((hackathon) => (
                  <div
                    key={hackathon._id}
                    className="border-2 border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {hackathon.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {hackathon.description}
                        </p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span className={`px-2 py-1 rounded ${getStatusColor(hackathon.status)}`}>
                            {hackathon.status.toUpperCase()}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            Starts: {new Date(hackathon.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => fetchRegistrations(hackathon._id)}
                        className="btn-primary"
                      >
                        View Registrations
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedHackathon && (
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Registrations ({registrations.length} teams)
              </h2>

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
                                 {idx + 1}. {teammate.name} - {teammate.email}
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
