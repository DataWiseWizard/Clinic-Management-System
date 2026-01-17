import DashboardLayout from "../../components/layout/DashboardLayout";
import BillingConsole from "../../features/billing/BillingConsole";

export default function ReceptionBilling() {
  return (
    <DashboardLayout role="receptionist">
        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Billing & Invoices</h1>
            <p className="text-gray-500">Collect payments and generate patient receipts.</p>
        </div>
        
        <BillingConsole />
    </DashboardLayout>
  );
}