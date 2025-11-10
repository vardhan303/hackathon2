import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function AdminPanel() {
  const [hackathonRequests, setHackathonRequests] = useState([]);
  const [judgeRequests, setJudgeRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [res1, res2] = await Promise.all([
        api.get("/request/hackathon"),
        api.get("/judge/requests")
      ]);
      setHackathonRequests(res1.data);
      setJudgeRequests(res2.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveHackathonRequest = async (id) => {
    try {
      await api.put(`/request/hackathon/${id}/approve`);
      alert("Hackathon request approved!");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve request");
    }
  };

  const rejectHackathonRequest = async (id) => {
    try {
      await api.put(`/request/hackathon/${id}/reject`);
      alert("Hackathon request rejected!");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject request");
    }
  };

  const approveJudgeRequest = async (id) => {
    try {
      await api.put(`/judge/request/${id}/approve`);
      alert("Judge request approved!");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve judge request");
    }
  };

  const rejectJudgeRequest = async (id) => {
    try {
      await api.put(`/judge/request/${id}/reject`);
      alert("Judge request rejected!");
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject judge request");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-8 text-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Panel 👨‍💼</h1>
        <Link
          to="/admin/management"
          className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 font-medium"
        >
          Manage Users & Hackathons
        </Link>
      </div>

      {/* Hackathon Requests Section */}
      <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          Hackathon Creation Requests ({hackathonRequests.length})
        </h2>
        
        {hackathonRequests.length === 0 ? (
          <p className="text-gray-500">No pending hackathon requests.</p>
        ) : (
          <div className="space-y-3">
            {hackathonRequests.map((request) => (
              <div
                key={request._id}
                className="border p-4 rounded-lg flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-lg">
                    {request.userId?.name || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.userId?.email || "No email"}
                  </p>
                  {request.reason && (
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Reason:</strong> {request.reason}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => approveHackathonRequest(request._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => rejectHackathonRequest(request._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Judge Requests Section */}
      <section className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">
          Judge Requests ({judgeRequests.length})
        </h2>
        
        {judgeRequests.length === 0 ? (
          <p className="text-gray-500">No pending judge requests.</p>
        ) : (
          <div className="space-y-3">
            {judgeRequests.map((request) => (
              <div
                key={request._id}
                className="border p-4 rounded-lg flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-lg">
                    {request.userId?.name || "Unknown Judge"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {request.userId?.email || "No email"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <strong>Hackathon:</strong> {request.hackathonId?.name || "Unknown"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => approveJudgeRequest(request._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => rejectJudgeRequest(request._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}