import { useState, useEffect } from "react";
import { getPatientHistory, startConsultation, finishConsultation } from "./doctorService";
import { subscribeToQueue } from "../queue/queueService";

export default function DoctorConsole() {
    const [queue, setQueue] = useState([]);
    const [activeToken, setActiveToken] = useState(null);
    const [history, setHistory] = useState([]);
    const [notes, setNotes] = useState({ symptoms: "", diagnosis: "", prescription: "" });
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToQueue((data) => {
            setQueue(data);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (activeToken) {
            setLoadingHistory(true);
            getPatientHistory(activeToken.patientId)
                .then(setHistory)
                .catch(err => alert("History Error (Check Console for Index Link): " + err.message))
                .finally(() => setLoadingHistory(false));
        }
    }, [activeToken]);

    const handleStart = async (appointment) => {
        setActiveToken(appointment);
        await startConsultation(appointment.id);
    };

    const handleFinish = async () => {
        if (!confirm("Finish consultation and send to billing?")) return;
        try {
            await finishConsultation(activeToken.id, notes, 50);
            setActiveToken(null);
            setNotes({ symptoms: "", diagnosis: "", prescription: "" });
            setHistory([]);
            alert("Patient sent to Billing.");
        } catch (e) {
            alert("Error: " + e.message);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] w-full relative z-10">
            <div className="bg-white p-4 rounded shadow overflow-y-auto">
                <h3 className="font-bold text-gray-700 mb-4">Waiting Room</h3>
                {queue.length === 0 && <p className="text-gray-400">Queue is empty.</p>}
                {queue.map(apt => (
                    <div key={apt.id} className="p-3 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <span className="font-bold text-blue-600">#{apt.tokenNumber}</span>
                            <span className="ml-2">{apt.patientName}</span>
                        </div>
                        <button
                            onClick={() => handleStart(apt)}
                            disabled={!!activeToken}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 disabled:opacity-50"
                        >
                            {activeToken?.id === apt.id ? "Active" : "Call In"}
                        </button>
                    </div>
                ))}
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded shadow flex flex-col">
                {!activeToken ? (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                        Select a patient from the queue to start consultation.
                    </div>
                ) : (
                    <>
                        <div className="border-b pb-4 mb-4 flex justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">{activeToken.patientName}</h2>
                                <p className="text-gray-500 text-sm">Age: {activeToken.age || "N/A"} • Contact: {activeToken.contact}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-red-500 font-bold">In Consultation</div>
                                <div className="text-xs text-gray-400">Started: Just now</div>
                            </div>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
                            <div className="overflow-y-auto pr-2 border-r">
                                <h4 className="font-bold text-gray-700 mb-2">Medical History</h4>
                                {loadingHistory && <p>Loading records...</p>}
                                {!loadingHistory && history.length === 0 && <p className="text-sm text-gray-400">No previous visits.</p>}

                                {history.map(record => (
                                    <div key={record.id} className="mb-4 p-3 bg-gray-50 rounded text-sm">
                                        <div className="font-bold text-gray-800">{record.timestamps.created?.toDate().toLocaleDateString()}</div>
                                        <div className="text-gray-600 mt-1"><span className="font-medium">Dx:</span> {record.clinicalData?.diagnosis}</div>
                                        <div className="text-gray-500 mt-1 italic">"{record.clinicalData?.prescription}"</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                                    <input
                                        className="w-full border rounded p-2 mt-1"
                                        placeholder="e.g. Acute Bronchitis"
                                        value={notes.diagnosis}
                                        onChange={e => setNotes({ ...notes, diagnosis: e.target.value })}
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700">Prescription / Notes</label>
                                    <textarea
                                        className="w-full h-full border rounded p-2 mt-1 resize-none"
                                        placeholder="Rx: Amoxicillin 500mg..."
                                        value={notes.prescription}
                                        onChange={e => setNotes({ ...notes, prescription: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={handleFinish}
                                    className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 shadow-lg"
                                >
                                    Finalize & Send to Bill
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}