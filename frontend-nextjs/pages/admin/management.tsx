import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { formatDate } from "@/utils/formatDate";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  createdAt: string;
}

interface Hackathon {
  _id: string;
  name: string;
  description: string;
  theme?: string;
  startDate: string;
  endDate: string;
  organizer: string;
  organizerEmail: string;
  phone: string;
  organization: string;
  locationType: string;
  venue?: string;
  maxTeamSize: number;
  maxTeams: number;
  status?: string;
  registrationRequired?: boolean;
  manualApproval?: boolean;
  allowTeamFormation?: boolean;
  allowLateSubmissions?: boolean;
  publicResults?: boolean;
}

export default function AdminManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, hackathonsRes] = await Promise.all([
        api.get("/auth/users"),
        api.get("/hackathons")
      ]);
      console.log('Users:', usersRes.data);
      console.log('Hackathons:', hackathonsRes.data);
      setUsers(usersRes.data);
      setHackathons(hackathonsRes.data);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      console.error("Error response:", err.response?.data);
      alert(`Failed to fetch data: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserApproval = async (userId: string, currentStatus: boolean) => {
    try {
      await api.put(`/auth/users/${userId}/status`, { approved: !currentStatus });
      alert("User status updated!");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update user status");
    }
  };

  const updateHackathonStatus = async (hackathonId: string, newStatus: string) => {
    try {
      await api.put(`/hackathons/${hackathonId}/status`, { status: newStatus });
      alert("Hackathon status updated!");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update hackathon status");
    }
  };

  const deleteHackathon = async (hackathonId: string) => {
    if (!window.confirm("Are you sure you want to delete this hackathon?")) {
      return;
    }

    try {
      await api.delete(`/hackathons/${hackathonId}`);
      alert("Hackathon deleted successfully!");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete hackathon");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute role="admin">
        <Navbar />
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute role="admin">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-8">
        <h1 className="text-4xl font-bold mb-8">System Admin Management 👨‍💼</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded font-medium ${
              activeTab === "users"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Users Management
          </button>
          <button
            onClick={() => setActiveTab("hackathons")}
            className={`px-6 py-3 rounded font-medium ${
              activeTab === "hackathons"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Hackathons Management
          </button>
        </div>

        {/* Users Management Tab */}
        {activeTab === "users" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              All Users ({users.length})
            </h2>

            {users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-3 text-left">Name</th>
                      <th className="border p-3 text-left">Email</th>
                      <th className="border p-3 text-left">Role</th>
                      <th className="border p-3 text-left">Status</th>
                      <th className="border p-3 text-left">Joined</th>
                      <th className="border p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="border p-3">{user.name}</td>
                        <td className="border p-3">{user.email}</td>
                        <td className="border p-3">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : user.role === "judge"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="border p-3">
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              user.approved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.approved ? "Approved" : "Not Approved"}
                          </span>
                        </td>
                        <td className="border p-3 text-sm text-gray-600">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="border p-3">
                          {user.role !== "admin" && (
                            <button
                              onClick={() => toggleUserApproval(user._id, user.approved)}
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                user.approved
                                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                            >
                              {user.approved ? "Revoke" : "Approve"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Hackathons Management Tab */}
        {activeTab === "hackathons" && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">
              All Hackathons ({hackathons.length})
            </h2>

            {hackathons.length === 0 ? (
              <p className="text-gray-500">No hackathons found.</p>
            ) : (
              <div className="space-y-4">
                {hackathons.map((hackathon) => (
                  <div
                    key={hackathon._id}
                    className="border p-4 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-blue-600">
                          {hackathon.name}
                        </h3>
                        <p className="text-gray-600 mt-2">{hackathon.description}</p>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                          {hackathon.theme && (
                            <p>
                              <strong>Theme:</strong> {hackathon.theme}
                            </p>
                          )}
                          <p>
                            <strong>Organizer:</strong> {hackathon.organizer}
                          </p>
                          <p>
                            <strong>Email:</strong> {hackathon.organizerEmail}
                          </p>
                          <p>
                            <strong>Phone:</strong> {hackathon.phone}
                          </p>
                          <p>
                            <strong>Organization:</strong> {hackathon.organization}
                          </p>
                          <p>
                            <strong>Venue:</strong> {hackathon.venue || (hackathon.locationType === "online" ? "Online" : "Not specified")}
                          </p>
                          <p>
                            <strong>Start:</strong> {formatDate(hackathon.startDate)}
                          </p>
                          <p>
                            <strong>End:</strong> {formatDate(hackathon.endDate)}
                          </p>
                          <p>
                            <strong>Max Team Size:</strong> {hackathon.maxTeamSize}
                          </p>
                          <p>
                            <strong>Max Teams:</strong> {hackathon.maxTeams}
                          </p>
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        <span
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            hackathon.status === "open"
                              ? "bg-green-100 text-green-800"
                              : hackathon.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : hackathon.status === "closed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {hackathon.status?.toUpperCase() || "DRAFT"}
                        </span>

                        <select
                          onChange={(e) =>
                            updateHackathonStatus(hackathon._id, e.target.value)
                          }
                          className="border p-2 rounded text-sm"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Change Status
                          </option>
                          <option value="draft">Draft</option>
                          <option value="open">Open</option>
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                        </select>

                        <button
                          onClick={() => deleteHackathon(hackathon._id)}
                          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}