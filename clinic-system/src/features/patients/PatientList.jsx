import { useEffect, useState } from "react";
import { searchPatients, deletePatient } from "./patientService";
import { addToQueue } from "../queue/queueService";

export default function PatientList({ refreshTrigger }) {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchPatients = async () => {
    const data = await searchPatients(searchTerm);
    setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, refreshTrigger]);

  const handleAddToQueue = async (patient) => {
    if (!confirm(`Add ${patient.fullName} to the queue?`)) return;

    setProcessingId(patient.id);
    try {
      await addToQueue(patient.id, patient);
      alert(`Token generated for ${patient.fullName}`);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}? This cannot be undone.`)) return;

    try {
      await deletePatient(id);
      fetchPatients(); // Refresh the list immediately
    } catch (error) {
      alert("Error deleting patient: " + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Patient Records</h3>
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 rounded text-sm w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button
                    onClick={() => handleAddToQueue(patient)}
                    disabled={processingId === patient.id}
                    className="hover:underline disabled:text-gray-400 font-semibold"
                  >
                    {processingId === patient.id ? "Adding..." : "Add to Queue"}
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id, patient.fullName)}
                    className="text-red-500 hover:text-red-700 hover:underline font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500 text-sm">No patients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}