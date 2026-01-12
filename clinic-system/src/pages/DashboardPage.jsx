import { useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import PatientForm from "../features/patients/PatientForm";
import PatientList from "../features/patients/PatientList";
import QueueList from "../features/queue/QueueList";
import DoctorConsole from "../features/doctor/DoctorConsole";
import BillingList from "../features/billing/BillingList";
import NotificationBell from "../components/ui/NotificationBell";
import IncomingRequests from "../components/dashboard/IncomingRequests";

export default function DashboardPage() {
  const { logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-600">Clinic CMS</h1>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">v2026.1</span>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell />
          <button onClick={logout} className="text-red-500 text-sm font-medium">Logout</button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-700 mb-4 px-1">Reception Desk</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <IncomingRequests />
              <PatientForm onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-6">
              <BillingList />
              <QueueList />
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <PatientList refreshTrigger={refreshTrigger} />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-700 mb-4 px-1">Doctor's Console</h2>
          <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <DoctorConsole />
          </div>
        </div>
      </main>
    </div>
  );
}