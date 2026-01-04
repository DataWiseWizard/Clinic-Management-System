import { useEffect, useState } from "react";
import { subscribeToBilling, processPayment } from "./billingService";

export default function BillingList() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToBilling((data) => {
            setInvoices(data);
        });
        return () => unsubscribe();
    }, []);

    const handlePay = async (inv) => {
        if (!confirm(`Collect $${inv.billing.total} from ${inv.patientName}?`)) return;

        setLoading(true);
        try {
            await processPayment(inv.id);
        } catch (e) {
            alert("Error processing payment: " + e.message);
        } finally {
            setLoading(false);
        }
    };
    
    if (invoices.length === 0) return null;

    return (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 shadow-sm mb-6 animate-pulse-slow">
            <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center">
                <span className="mr-2">💰</span> Pending Payments ({invoices.length})
            </h3>

            <div className="space-y-3">
                {invoices.map((inv) => (
                    <div key={inv.id} className="bg-white p-3 rounded border border-orange-100 flex justify-between items-center">
                        <div>
                            <div className="font-bold text-gray-800">{inv.patientName}</div>
                            <div className="text-xs text-gray-500">
                                Dr. Fee: ${inv.billing.consultationFee} • Rx: ${inv.billing.medicationCost || 0}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-gray-800">${inv.billing.total}</span>
                            <button
                                onClick={() => handlePay(inv)}
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold shadow transition"
                            >
                                Mark Paid
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}