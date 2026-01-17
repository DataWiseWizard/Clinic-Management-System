import DoctorConsole from "../../features/doctor/DoctorConsole";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PatientList from "../../features/patients/PatientList"

export default function DoctorDashboard() {
    return (
        <DashboardLayout role="doctor">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Consultation Room</h1>
                <p className="text-gray-500">Manage patient queues and medical records.</p>
            </div>
            <DoctorConsole />
        </DashboardLayout>
    );
}