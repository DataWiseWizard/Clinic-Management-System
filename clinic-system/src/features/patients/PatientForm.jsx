import { useState } from "react";
import { addPatient } from "./patientService";

export default function PatientForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    age: "",
    gender: "male",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await addPatient(formData);
      setFormData({ fullName: "", contact: "", age: "", gender: "male" });
      alert("Patient Registered Successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <h3 className="text-lg font-bold mb-4 text-gray-800">New Patient Registration</h3>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              placeholder="10 digits"
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
            >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Checking..." : "Register Patient"}
        </button>
      </form>
    </div>
  );
}