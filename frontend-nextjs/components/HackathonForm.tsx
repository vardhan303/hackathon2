import { useState } from "react";

interface FormData {
  name: string;
  description: string;
  theme: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  submissionDeadline: string;
  locationType: string;
  venue: string;
  timezone: string;
  maxTeamSize: number;
  maxTeams: number;
  phone: string;
  organization: string;
  registrationRequired: boolean;
  manualApproval: boolean;
  allowTeamFormation: boolean;
  allowLateSubmissions: boolean;
  publicResults: boolean;
}

interface HackathonFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

export default function HackathonForm({ onSubmit, initialData = {} }: HackathonFormProps) {
  const [form, setForm] = useState<FormData>({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = target.checked;
    
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Basic Information
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Hackathon Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input w-full"
            placeholder="Enter a catchy name for your hackathon"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="input w-full h-32 resize-none"
            placeholder="Describe what makes your hackathon unique..."
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Theme
          </label>
          <input
            type="text"
            name="theme"
            value={form.theme}
            onChange={handleChange}
            className="input w-full"
            placeholder="e.g., AI & Machine Learning, Web3, Sustainability"
          />
        </div>
      </div>

      {/* Schedule Section */}
      <div className="border-l-4 border-green-500 pl-4 mt-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          Event Schedule
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Registration Deadline *
          </label>
          <input
            type="datetime-local"
            name="registrationDeadline"
            value={form.registrationDeadline}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Submission Deadline *
          </label>
          <input
            type="datetime-local"
            name="submissionDeadline"
            value={form.submissionDeadline}
            onChange={handleChange}
            className="input w-full"
            required
          />
        </div>
      </div>

      {/* Location Section */}
      <div className="border-l-4 border-purple-500 pl-4 mt-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Location Details
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Location Type *
          </label>
          <select
            name="locationType"
            value={form.locationType}
            onChange={handleChange}
            className="input w-full"
            required
          >
            <option value="online">🌐 Online</option>
            <option value="onsite">📍 On-site</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Venue
          </label>
          <input
            type="text"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            className="input w-full"
            placeholder="Enter venue or meeting link"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Timezone
          </label>
          <input
            type="text"
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            className="input w-full"
            placeholder="e.g., Asia/Calcutta"
          />
        </div>
      </div>

      {/* Team Configuration */}
      <div className="border-l-4 border-orange-500 pl-4 mt-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Team Configuration
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Max Team Size *
          </label>
          <input
            type="number"
            name="maxTeamSize"
            value={form.maxTeamSize}
            onChange={handleChange}
            className="input w-full"
            min="1"
            placeholder="e.g., 4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Max Teams *
          </label>
          <input
            type="number"
            name="maxTeams"
            value={form.maxTeams}
            onChange={handleChange}
            className="input w-full"
            min="1"
            placeholder="e.g., 50"
            required
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-l-4 border-red-500 pl-4 mt-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          Contact Information
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Phone *
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input w-full"
            placeholder="+1 234 567 8900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Organization *
          </label>
          <input
            type="text"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            className="input w-full"
            placeholder="Your organization name"
            required
          />
        </div>
      </div>

      {/* Event Settings */}
      <div className="border-l-4 border-indigo-500 pl-4 mt-8">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Event Settings
        </h3>
      </div>

      <div className="border border-gray-300 dark:border-gray-600 rounded-xl p-6 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="registrationRequired"
            checked={form.registrationRequired}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Registration Required
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="manualApproval"
            checked={form.manualApproval}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Manual Approval Required
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="allowTeamFormation"
            checked={form.allowTeamFormation}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Allow Team Formation
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="allowLateSubmissions"
            checked={form.allowLateSubmissions}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Allow Late Submissions
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="publicResults"
            checked={form.publicResults}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            Public Results
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          className="flex-1 btn-primary text-lg py-4 flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
          Create Hackathon
        </button>
      </div>
    </form>
  );
}