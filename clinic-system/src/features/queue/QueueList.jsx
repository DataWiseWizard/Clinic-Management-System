import { useEffect, useState } from "react";
import { subscribeToQueue } from "./queueService";

export default function QueueList() {
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToQueue((data) => {
            setQueue(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <div className="p-4 text-gray-500">Loading Queue...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex justify-between">
                <span>Current Queue</span>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {queue.length} Waiting
                </span>
            </h2>

            {queue.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No patients in queue.</p>
            ) : (
                <div className="space-y-3">
                    {queue.map((apt) => (
                        <div key={apt.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded shadow-sm flex justify-between items-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-700">Token #{apt.tokenNumber}</div>
                                <div className="font-medium text-gray-900">{apt.patientName}</div>
                                <div className="text-xs text-gray-500">Waiting since {apt.createdAt?.toDate().toLocaleTimeString()}</div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                    Waiting
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}