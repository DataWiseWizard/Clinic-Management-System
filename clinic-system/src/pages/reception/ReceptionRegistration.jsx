import DashboardLayout from "../../components/layout/DashboardLayout";
import PatientForm from "../../features/patients/PatientForm";

export default function ReceptionRegistration() {
  return (
    <DashboardLayout role="receptionist">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">New Patient Registration</h1>
          <p className="text-gray-500">Create a record for a new visitor.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <PatientForm onSuccess={() => alert("Patient Registered (Replace with Toast!)")} />
        </div>
      </div>
    </DashboardLayout>
  );
}