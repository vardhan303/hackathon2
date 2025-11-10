import { useEffect, useState } from "react";
import api from "@/lib/axios";
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
  organizer: string;
}

export default function JudgeRequests() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/hackathons");
      setHackathons(res.data.filter((h: any) => h.status !== 'draft'));
    } catch (err) {
      console.error("Error fetching hackathons:", err);
    } finally {
      setLoading(false);
    }
  };

  const requestToJudge = async (hackathonId: string) => {
    try {
      await api.post("/judge/request", { hackathonId });
      alert("Judge request submitted successfully!");
      fetchHackathons();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit judge request");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute role="judge">
        <Navbar />
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute role="judge">
      <Navbar />
      <div className="max-w-6xl mx-auto mt-8">
        <h1 className="text-4xl font-bold mb-8">Judge Requests ⚖️</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Available Hackathons to Judge</h2>
          
          {hackathons.length === 0 ? (
            <p className="text-gray-500">No hackathons available for judging.</p>
          ) : (
            <div className="grid gap-4">
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
                          <strong>Organizer:</strong> {hackathon.organizer}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => requestToJudge(hackathon._id)}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-medium"
                      >
                        Request to Judge
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}