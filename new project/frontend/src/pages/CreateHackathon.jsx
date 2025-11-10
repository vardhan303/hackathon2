import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import HackathonForm from "../components/HackathonForm";

export default function CreateHackathon() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await api.post("/hackathons", formData);
      alert("Hackathon created successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create hackathon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">
          Create New Hackathon
        </h1>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-xl">Creating hackathon...</p>
          </div>
        ) : (
          <HackathonForm onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
}