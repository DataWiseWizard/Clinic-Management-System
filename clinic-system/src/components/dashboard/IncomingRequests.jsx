import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    runTransaction,
    doc,
    deleteDoc
} from "firebase/firestore";
import { db } from "../../lib/firebase";

const IncomingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("IncomingRequests: Setting up listener...");
        const q = query(
            collection(db, "appointments"),
            where("status", "==", "request")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("IncomingRequests: Snapshot received!", snapshot.size, "docs");
            const pendingData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(pendingData);
        });

        return () => unsubscribe();
    }, []);

    const handleApprove = async (request) => {
        if (loading) return;
        setLoading(true);

        try {
            await runTransaction(db, async (transaction) => {
                const todayStr = new Date().toISOString().split('T')[0];
                const statsRef = doc(db, "stats", todayStr);
                const statsDoc = await transaction.get(statsRef);

                let newTokenNumber = 1;

                if (!statsDoc.exists()) {
                    transaction.set(statsRef, { lastTokenNumber: 1 });
                } else {
                    newTokenNumber = statsDoc.data().lastTokenNumber + 1;
                    transaction.update(statsRef, { lastTokenNumber: newTokenNumber });
                }

                const appointmentRef = doc(db, "appointments", request.id);
                transaction.update(appointmentRef, {
                    status: "waiting",
                    tokenNumber: newTokenNumber,
                    approvedAt: new Date()
                });
            });
        } catch (error) {
            console.error("Transaction failed: ", error);
            alert("Error approving patient. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Reject this request?")) return;
        await deleteDoc(doc(db, "appointments", id));
    };

    if (requests.length === 0) return null;

    return (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 animate-pulse-slow">
            <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">
                <span className="mr-2">🔔</span> Incoming Requests ({requests.length})
            </h3>

            <div className="space-y-3">
                {requests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                        <div>
                            <p className="font-semibold text-gray-800">{req.patientName}</p>
                            <p className="text-sm text-gray-500">{req.patientPhone}</p>
                            {req.symptoms && (
                                <p className="text-xs text-red-500 mt-1">Sx: {req.symptoms}</p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleReject(req.id)}
                                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleApprove(req)}
                                disabled={loading}
                                className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 shadow-sm"
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IncomingRequests;