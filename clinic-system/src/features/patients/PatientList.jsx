import { useEffect, useState } from "react";
import { searchPatients, deletePatient } from "./patientService";
import { addToQueue } from "../queue/queueService";
import { useNotifications } from "../notifications/NotificationContext";
import { FaUserPlus, FaTrash, FaSpinner, FaSearch } from "react-icons/fa";

export default function PatientList({ refreshTrigger }) {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const { addNotification } = useNotifications();

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
      addNotification(
        "Queue Update",
        `${patient.fullName} added to queue. Token generated.`
      );
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
      fetchPatients();
    } catch (error) {
      alert("Error deleting patient: " + error.message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 p-1">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Contact</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-blue-50 transition-colors group">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{patient.fullName}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{patient.contact}</td>
                <td className="px-4 py-3 whitespace-nowrap text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleAddToQueue(patient)}
                    disabled={processingId === patient.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition disabled:opacity-50"
                  >
                    {processingId === patient.id ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
                    Check In
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id, patient.fullName)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition opacity-0 group-hover:opacity-100"
                    title="Delete Record"
                  >
                    <FaTrash size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-400 text-sm">
                  No patients found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}