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
  status: string;
}

interface JudgeRequest {
  _id: string;
  hackathonId: Hackathon;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Team {
  _id: string;
  userId: {
    name: string;
    email: string;
    registrationNumber: string;
  };
  registrationNumber: string;
  teamSize: number;
  teammates: Array<{
    name: string;
    registrationNumber: string;
    email: string;
  }>;
  evaluation?: {
    criteria: {
      innovation: number;
      technical: number;
      design: number;
      presentation: number;
    };
    totalScore: number;
    feedback: string;
    status: string;
  };
}

export default function JudgeDashboard() {
  const [view, setView] = useState<'request' | 'assigned'>('assigned');
  const [availableHackathons, setAvailableHackathons] = useState<Hackathon[]>([]);
  const [assignedHackathons, setAssignedHackathons] = useState<Hackathon[]>([]);
  const [myRequests, setMyRequests] = useState<JudgeRequest[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [evaluatingTeam, setEvaluatingTeam] = useState<Team | null>(null);
  const [criteria, setCriteria] = useState({
    innovation: 0,
    technical: 0,
    design: 0,
    presentation: 0
  });
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssignedHackathons();
    fetchAvailableHackathons();
    fetchMyRequests();
  }, []);

  const fetchAssignedHackathons = async () => {
    try {
      const res = await api.get("/judge/assigned-hackathons");
      setAssignedHackathons(res.data);
    } catch (err) {
      console.error("Error fetching assigned hackathons:", err);
    }
  };

  const fetchAvailableHackathons = async () => {
    try {
      const res = await api.get("/hackathons");
      setAvailableHackathons(res.data.filter((h: any) => h.status === 'open'));
    } catch (err) {
      console.error("Error fetching hackathons:", err);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await api.get("/judge/my-requests");
      setMyRequests(res.data);
    } catch (err) {
      console.error("Error fetching my requests:", err);
    }
  };

  const fetchTeams = async (hackathonId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/judge/hackathon/${hackathonId}/teams`);
      setTeams(res.data);
      setSelectedHackathon(hackathonId);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to fetch teams");
    } finally {
      setLoading(false);
    }
  };

  const requestToJudge = async (hackathonId: string) => {
    try {
      await api.post("/judge/request", { hackathonId });
      alert("Judge request submitted successfully! Wait for admin approval.");
      fetchMyRequests();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit judge request");
    }
  };

  const startEvaluation = (team: Team) => {
    setEvaluatingTeam(team);
    if (team.evaluation) {
      setCriteria(team.evaluation.criteria);
      setFeedback(team.evaluation.feedback || "");
    } else {
      setCriteria({ innovation: 0, technical: 0, design: 0, presentation: 0 });
      setFeedback("");
    }
  };

  const submitEvaluation = async () => {
    if (!evaluatingTeam || !selectedHackathon) return;

    try {
      await api.post("/judge/evaluate", {
        hackathonId: selectedHackathon,
        registrationId: evaluatingTeam._id,
        criteria,
        feedback
      });
      alert("Evaluation submitted successfully!");
      setEvaluatingTeam(null);
      fetchTeams(selectedHackathon);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit evaluation");
    }
  };

  const totalScore = criteria.innovation + criteria.technical + criteria.design + criteria.presentation;

  return (
    <ProtectedRoute role="judge">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="card p-8 mb-8 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Judge Dashboard ⚖️
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Evaluate teams and provide feedback</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setView('assigned'); setSelectedHackathon(null); }}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    view === 'assigned'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  My Assignments
                </button>
                <button
                  onClick={() => { setView('request'); setSelectedHackathon(null); }}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    view === 'request'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Request to Judge
                </button>
              </div>
            </div>
          </div>

          {/* Assigned Hackathons View */}
          {view === 'assigned' && !selectedHackathon && (
            <div className="card p-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Assigned Hackathons ({assignedHackathons.length})
                </h2>
              </div>

              {assignedHackathons.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                    No hackathons assigned yet.
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Request to judge hackathons to get started!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {assignedHackathons.map((hackathon) => (
                    <div
                      key={hackathon._id}
                      className="border-2 border-gray-200 dark:border-gray-700 p-6 rounded-xl hover:shadow-2xl hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {hackathon.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              hackathon.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                              {hackathon.status?.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{hackathon.description}</p>
                          <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                            {hackathon.theme && (
                              <span>📌 Theme: {hackathon.theme}</span>
                            )}
                            <span>📅 {formatDate(hackathon.startDate)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => fetchTeams(hackathon._id)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                        >
                          Evaluate Teams
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Teams Evaluation View */}
          {view === 'assigned' && selectedHackathon && !evaluatingTeam && (
            <div className="card p-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Teams to Evaluate ({teams.length})
                </h2>
                <button
                  onClick={() => { setSelectedHackathon(null); setTeams([]); }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  ← Back to Hackathons
                </button>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 dark:text-gray-400">No approved teams yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      className="border-2 border-gray-200 dark:border-gray-700 p-6 rounded-lg bg-white dark:bg-gray-800"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {team.userId.name}
                            </h3>
                            {team.evaluation && (
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                team.evaluation.status === 'submitted'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}>
                                {team.evaluation.status === 'submitted' ? '✓ Evaluated' : 'Draft'}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Registration: {team.registrationNumber} | Team Size: {team.teamSize}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Email: {team.userId.email}
                          </p>
                          {team.evaluation && (
                            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                                Current Score: {team.evaluation.totalScore}/100
                              </p>
                              <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <span>Innovation: {team.evaluation.criteria.innovation}/25</span>
                                <span>Technical: {team.evaluation.criteria.technical}/25</span>
                                <span>Design: {team.evaluation.criteria.design}/25</span>
                                <span>Presentation: {team.evaluation.criteria.presentation}/25</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => startEvaluation(team)}
                          className={`px-6 py-3 rounded-lg font-semibold ${
                            team.evaluation
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                        >
                          {team.evaluation ? 'Edit Evaluation' : 'Start Evaluation'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Evaluation Modal */}
          {evaluatingTeam && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Evaluate: {evaluatingTeam.userId.name}
                    </h3>
                    <button
                      onClick={() => setEvaluatingTeam(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Scoring Criteria */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Innovation */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          💡 Innovation (0-25)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="25"
                          value={criteria.innovation}
                          onChange={(e) => setCriteria({...criteria, innovation: Math.min(25, Math.max(0, parseInt(e.target.value) || 0))})}
                          className="input w-full"
                        />
                      </div>

                      {/* Technical */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          💻 Technical Skill (0-25)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="25"
                          value={criteria.technical}
                          onChange={(e) => setCriteria({...criteria, technical: Math.min(25, Math.max(0, parseInt(e.target.value) || 0))})}
                          className="input w-full"
                        />
                      </div>

                      {/* Design */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          🎨 Design & UX (0-25)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="25"
                          value={criteria.design}
                          onChange={(e) => setCriteria({...criteria, design: Math.min(25, Math.max(0, parseInt(e.target.value) || 0))})}
                          className="input w-full"
                        />
                      </div>

                      {/* Presentation */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          🎤 Presentation (0-25)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="25"
                          value={criteria.presentation}
                          onChange={(e) => setCriteria({...criteria, presentation: Math.min(25, Math.max(0, parseInt(e.target.value) || 0))})}
                          className="input w-full"
                        />
                      </div>
                    </div>

                    {/* Total Score Display */}
                    <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-800 dark:text-purple-300">Total Score:</span>
                        <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalScore}/100</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${totalScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        📝 Feedback (Optional, max 500 characters)
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value.slice(0, 500))}
                        className="input w-full h-32"
                        placeholder="Provide constructive feedback..."
                      />
                      <p className="text-xs text-gray-500">{feedback.length}/500 characters</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={submitEvaluation}
                      className="btn-primary flex-1"
                    >
                      Submit Evaluation
                    </button>
                    <button
                      onClick={() => setEvaluatingTeam(null)}
                      className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Request to Judge View */}
          {view === 'request' && (
            <div className="space-y-6 animate-slide-up">
              {/* My Judge Requests */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    My Judge Requests ({myRequests.length})
                  </h2>
                </div>

                {myRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No requests submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border-2 border-gray-200 dark:border-gray-700 p-5 rounded-xl bg-white dark:bg-gray-800 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {request.hackathonId.name}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                request.status === 'approved'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : request.status === 'rejected'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}>
                                {request.status === 'approved' && '✅ ACCEPTED'}
                                {request.status === 'rejected' && '❌ REJECTED'}
                                {request.status === 'pending' && '⏳ PENDING'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {request.hackathonId.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              Requested on: {formatDate(request.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Hackathons */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Request to Judge Hackathons
                  </h2>
                </div>

                {availableHackathons.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400">No hackathons available for judge requests.</p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {availableHackathons.map((hackathon) => {
                      const hasRequested = myRequests.some(r => r.hackathonId._id === hackathon._id);
                      const requestStatus = myRequests.find(r => r.hackathonId._id === hackathon._id)?.status;
                      
                      return (
                        <div
                          key={hackathon._id}
                          className="border-2 border-gray-200 dark:border-gray-700 p-6 rounded-xl hover:shadow-lg transition-all bg-white dark:bg-gray-800"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                  {hackathon.name}
                                </h3>
                                {hasRequested && (
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    requestStatus === 'approved'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                      : requestStatus === 'rejected'
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  }`}>
                                    {requestStatus?.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 mt-2">{hackathon.description}</p>
                              <div className="mt-3 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                                {hackathon.theme && <p>📌 Theme: {hackathon.theme}</p>}
                                <p>📅 {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => requestToJudge(hackathon._id)}
                              disabled={hasRequested}
                              className={`px-6 py-3 rounded-lg font-semibold ${
                                hasRequested
                                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                              }`}
                            >
                              {hasRequested ? 'Already Requested' : 'Request to Judge'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}