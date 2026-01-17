import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    addDoc,
    serverTimestamp
} from "firebase/firestore";
import { addToQueue } from "../../features/queue/queueService";
import { FaUserClock, FaCheck, FaTimes } from "react-icons/fa";

export default function IncomingRequests() {
    const [requests, setRequests] = useState([]);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "incoming_requests"), where("status", "==", "pending"));
        const unsub = onSnapshot(q, (snapshot) => {
            setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsub();
    }, []);

    const handleApprove = async (req) => {
        setProcessing(req.id);

        try {
            const patientRef = await addDoc(collection(db, "patients"), {
                fullName: req.fullName,
                contact: req.contact,
                createdAt: serverTimestamp()
            });
            const queueItem = await addToQueue(patientRef.id, {
                fullName: req.fullName,
                purpose: req.purpose
            });

            if (!queueItem || !queueItem.token) {
                throw new Error("Queue Service did not return a token!");
            }

            const reqRef = doc(db, "incoming_requests", req.id);
            await updateDoc(reqRef, {
                status: "approved",
                token: queueItem.token,
                queueId: queueItem.id,
                patientId: patientRef.id
            });
        } catch (error) {
            console.error("APPROVAL FAILED:", error);
            alert("Approval Failed: " + error.message);
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (id) => {
        if (!confirm("Reject this request?")) return;
        await updateDoc(doc(db, "incoming_requests", id), { status: "rejected" });
    };

    if (requests.length === 0) {
        return (
            <div className="bg-white rounded-xl p-4 mb-6 border border-dashed border-gray-300 text-center text-gray-400 text-sm">
                <FaUserClock className="mx-auto mb-2 text-gray-300" />
                No incoming kiosk requests
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-1 shadow-lg mb-6">
            <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FaUserClock className="text-indigo-600" />
                        Incoming Kiosk Requests
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">
                            {requests.length} New
                        </span>
                    </h3>
                </div>

                <div className="space-y-3">
                    {requests.map(req => (
                        <div key={req.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-100">
                            <div>
                                <p className="font-bold text-gray-800">{req.fullName}</p>
                                <p className="text-xs text-gray-500">{req.purpose} • {req.contact}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleReject(req.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                                >
                                    <FaTimes />
                                </button>
                                <button
                                    onClick={() => handleApprove(req)}
                                    disabled={processing === req.id}
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-md hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition disabled:opacity-50"
                                >
                                    {processing === req.id ? "..." : <><FaCheck /> Accept</>}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}