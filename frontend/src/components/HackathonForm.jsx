import { useState } from "react";

export default function HackathonForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    theme: initialData.theme || "",
    startDate: initialData.startDate || "",
    endDate: initialData.endDate || "",
    registrationDeadline: initialData.registrationDeadline || "",
    submissionDeadline: initialData.submissionDeadline || "",
    locationType: initialData.locationType || "online",
    venue: initialData.venue || "",
    timezone: initialData.timezone || "Asia/Calcutta",
    maxTeamSize: initialData.maxTeamSize || 4,
    maxTeams: initialData.maxTeams || 50,
    phone: initialData.phone || "",
    organization: initialData.organization || "",
    registrationRequired: initialData.registrationRequired || false,
    manualApproval: initialData.manualApproval || false,
    allowTeamFormation: initialData.allowTeamFormation || false,
    allowLateSubmissions: initialData.allowLateSubmissions || false,
    publicResults: initialData.publicResults || false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Hackathon Name *</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full rounded h-24"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Theme</label>
        <input
          type="text"
          name="theme"
          value={form.theme}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date & Time *</label>
          <input
            type="datetime-local"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date & Time *</label>
          <input
            type="datetime-local"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Registration Deadline *</label>
          <input
            type="datetime-local"
            name="registrationDeadline"
            value={form.registrationDeadline}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Submission Deadline *</label>
          <input
            type="datetime-local"
            name="submissionDeadline"
            value={form.submissionDeadline}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location Type *</label>
          <select
            name="locationType"
            value={form.locationType}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          >
            <option value="online">Online</option>
            <option value="onsite">On-site</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Venue</label>
          <input
            type="text"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Timezone</label>
        <input
          type="text"
          name="timezone"
          value={form.timezone}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Max Team Size *</label>
          <input
            type="number"
            name="maxTeamSize"
            value={form.maxTeamSize}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Teams *</label>
          <input
            type="number"
            name="maxTeams"
            value={form.maxTeams}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            min="1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Organization *</label>
          <input
            type="text"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="registrationRequired"
            checked={form.registrationRequired}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm">Registration Required</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="manualApproval"
            checked={form.manualApproval}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm">Manual Approval Required</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allowTeamFormation"
            checked={form.allowTeamFormation}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm">Allow Team Formation</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="allowLateSubmissions"
            checked={form.allowLateSubmissions}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm">Allow Late Submissions</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="publicResults"
            checked={form.publicResults}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-sm">Public Results</span>
        </label>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 w-full font-medium"
      >
        Create Hackathon
      </button>
    </form>
  );
}