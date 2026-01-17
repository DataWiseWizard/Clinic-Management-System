import { useEffect, useState } from "react";
import { subscribeToBilling, subscribeToRecentPayments, processPayment } from "./billingService";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF";
import { FaMoneyBillWave, FaPrint, FaCheckCircle, FaClock } from "react-icons/fa";

export default function BillingConsole() {
    const [pending, setPending] = useState([]);
    const [history, setHistory] = useState([]);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        const unsubPending = subscribeToBilling(setPending);
        const unsubHistory = subscribeToRecentPayments(setHistory);
        return () => {
            unsubPending();
            unsubHistory();
        };
    }, []);

    const handlePayment = async (id) => {
        if (!confirm("Confirm payment received?")) return;
        setProcessing(id);
        try {
            await processPayment(id);
        } catch (e) {
            alert("Payment Failed: " + e.message);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100 flex justify-between items-center">
                    <h2 className="font-bold text-yellow-800 flex items-center gap-2">
                        <FaClock /> Pending Payments
                    </h2>
                    <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                        {pending.length}
                    </span>
                </div>
                <div className="p-4 space-y-3">
                    {pending.length === 0 && <p className="text-gray-400 text-center py-4">No pending bills.</p>}

                    {pending.map(apt => (
                        <div key={apt.id} className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition">
                            <div>
                                <h3 className="font-bold text-gray-800">{apt.patientName}</h3>
                                <p className="text-sm text-gray-500">Dr. {apt.doctorName || "Consultant"}</p>
                                <div className="mt-1 text-xs bg-gray-100 inline-block px-2 py-1 rounded text-gray-600">
                                    Token #{apt.tokenNumber}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-gray-900 mb-2">${apt.billing?.total}</div>
                                <button
                                    onClick={() => handlePayment(apt.id)}
                                    disabled={processing === apt.id}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm flex items-center gap-2"
                                >
                                    <FaMoneyBillWave /> {processing === apt.id ? "Processing..." : "Collect Cash"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-700 flex items-center gap-2">
                        <FaCheckCircle className="text-green-500" /> Recent Transactions
                    </h2>
                </div>
                <div className="p-4 space-y-3">
                    {history.length === 0 && <p className="text-gray-400 text-center py-4">No recent transactions.</p>}

                    {history.map(apt => (
                        <div key={apt.id} className="flex justify-between items-center p-3 border-b last:border-0">
                            <div>
                                <span className="font-medium text-gray-800">{apt.patientName}</span>
                                <span className="text-gray-400 text-sm ml-2">(${apt.billing?.total})</span>
                                <div className="text-xs text-gray-400">
                                    Paid: {apt.timestamps?.paymentTime?.toDate().toLocaleTimeString()}
                                </div>
                            </div>

                            <PDFDownloadLink
                                document={<InvoicePDF invoice={apt} />}
                                fileName={`Invoice_${apt.patientName}_${apt.tokenNumber}.pdf`}
                            >
                                {({ loading }) => (
                                    <button
                                        disabled={loading}
                                        className="text-blue-600 hover:bg-blue-50 px-3 py-2 rounded text-sm font-medium flex items-center gap-2"
                                    >
                                        <FaPrint /> {loading ? "Generating..." : "Print Receipt"}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}