import { useEffect, useState } from "react";
import { searchPatients } from "./patientService";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    const data = await searchPatients(searchTerm);
    setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
  }, [searchTerm]);

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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 cursor-pointer hover:underline">
                  Add to Queue
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