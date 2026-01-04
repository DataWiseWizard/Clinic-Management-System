import { useAuth } from "../features/auth/AuthContext";
import PatientForm from "../features/patients/PatientForm";
import PatientList from "../features/patients/PatientList";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">CMS Portal</h1>
        <button onClick={logout} className="text-red-500 text-sm hover:underline">Logout</button>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <PatientForm onSuccess={() => window.location.reload()} />
        </div>
        <div className="md:col-span-2">
          <PatientList />
        </div>
      </main>
    </div>
  );
}