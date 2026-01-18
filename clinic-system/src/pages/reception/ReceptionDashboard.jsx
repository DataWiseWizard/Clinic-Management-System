import { useState } from "react";
import QueueList from "../../features/queue/QueueList";
import PatientList from "../../features/patients/PatientList"
import DashboardLayout from "../../components/layout/DashboardLayout";
import IncomingRequests from "../../components/dashboard/IncomingRequests";

export default function ReceptionDashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  return (
    <DashboardLayout role="receptionist">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Front Desk</h1>
        <p className="text-gray-500">Manage patient check-ins and queue status.</p>
      </div>
      <IncomingRequests onPatientAdded={() => setRefreshTrigger(prev => prev + 1)} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="font-semibold text-blue-800">Patient Database</h2>
            <p className="text-xs text-blue-600">Search existing patients to check them in.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <PatientList refreshTrigger={refreshTrigger}/>
          </div>
        </div>
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100">
            <h2 className="font-semibold text-green-800">Live Queue</h2>
            <p className="text-xs text-green-600">Patients currently waiting for the doctor.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {QueueList ? <QueueList /> : <p className="text-gray-400 text-center py-8">Queue system loading...</p>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}