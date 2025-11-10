import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { formatDate } from "../utils/formatDate";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [hackathons, setHackathons] = useState([]);
  const [requestStatus, setRequestStatus] = useState(null);
  const [userApproved, setUserApproved] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHackathons();
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
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h1 className="text-4xl font-bold mb-6">
        Welcome, {user?.name || "User"}! 👋
      </h1>

      {/* User/Organizer Section */}
      {user?.role === "user" && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Organizer Actions</h2>
          
          {!userApproved && requestStatus !== "pending" ? (
            <div>
              <p className="mb-4 text-gray-600">
                You need admin approval to create hackathons. Submit a request below:
              </p>
              <textarea
                className="border p-3 w-full rounded mb-3"
                placeholder="Reason for creating hackathons..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows="3"
              />
              <button
                onClick={requestToCreateHackathon}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Request to Create Hackathon"}
              </button>
            </div>
          ) : requestStatus === "pending" ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              Your request is pending admin approval.
            </div>
          ) : (
            <div>
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                ✅ You are approved to create hackathons!
              </div>
              <button
                onClick={() => navigate("/create")}
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 font-medium"
              >
                Create New Hackathon
              </button>
            </div>
          )}
        </div>
      )}

      {/* Judge Section */}
      {user?.role === "judge" && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Judge Actions</h2>
          <button
            onClick={() => navigate("/judge")}
            className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 font-medium"
          >
            View Judge Requests
          </button>
        </div>
      )}

      {/* Admin Section */}
      {user?.role === "admin" && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Admin Actions</h2>
          <button
            onClick={() => navigate("/admin")}
            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 font-medium"
          >
            Go to Admin Panel
          </button>
        </div>
      )}

      {/* All Hackathons */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">All Hackathons</h2>
        
        {hackathons.length === 0 ? (
          <p className="text-gray-500">No hackathons available yet.</p>
        ) : (
          <div className="grid gap-4">
            {hackathons.map((hackathon) => (
              <div
                key={hackathon._id}
                className="border p-4 rounded-lg hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-blue-600">
                      {hackathon.name}
                    </h3>
                    <p className="text-gray-600 mt-2">{hackathon.description}</p>
                    <div className="mt-3 space-y-1 text-sm text-gray-500">
                      {hackathon.theme && (
                        <p>
                          <strong>Theme:</strong> {hackathon.theme}
                        </p>
                      )}
                      <p>
                        <strong>Start:</strong> {formatDate(hackathon.startDate)}
                      </p>
                      <p>
                        <strong>End:</strong> {formatDate(hackathon.endDate)}
                      </p>
                      <p>
                        <strong>Location:</strong> {hackathon.locationType === "online" ? "Online" : hackathon.venue}
                      </p>
                      <p>
                        <strong>Max Team Size:</strong> {hackathon.maxTeamSize} | <strong>Max Teams:</strong> {hackathon.maxTeams}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    hackathon.status === "open" ? "bg-green-100 text-green-800" :
                    hackathon.status === "active" ? "bg-blue-100 text-blue-800" :
                    hackathon.status === "closed" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {hackathon.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}