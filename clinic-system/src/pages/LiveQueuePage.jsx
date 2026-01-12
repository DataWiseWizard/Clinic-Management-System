import { useEffect, useState } from "react";
import { subscribeToQueue, getQueueHistory } from "../features/queue/queueService";
import { calculateWaitTime } from "../utils/analytics";

export default function LiveQueuePage() {
    const [queue, setQueue] = useState([]);
    const [history, setHistory] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {

        getQueueHistory().then(setHistory);
        const unsubscribe = subscribeToQueue(setQueue);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const currentPatient = queue.length > 0 ? queue[0] : null;
    const upcomingPatients = queue.slice(1);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
            <div className="flex justify-between items-end mb-12 border-b border-gray-700 pb-4">
                <div>
                    <h1 className="text-4xl font-bold text-blue-400">🏥 Live Queue Status</h1>
                    <p className="text-gray-400 mt-2">Please wait for your token number</p>
                </div>
                <div className="text-right">
                    <div className="text-5xl font-mono font-bold">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-gray-400">{currentTime.toLocaleDateString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-blue-600 rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-2xl transform scale-105">
                    <h2 className="text-blue-200 text-2xl uppercase tracking-widest font-bold mb-4">Now Serving</h2>
                    {currentPatient ? (
                        <>
                            <div className="text-[120px] font-bold leading-none mb-4">
                                #{currentPatient.tokenNumber}
                            </div>
                            <div className="text-4xl font-medium text-blue-100">
                                {currentPatient.patientName}
                            </div>
                            <div className="mt-8 bg-white text-blue-800 px-6 py-2 rounded-full font-bold text-lg animate-pulse">
                                Please proceed to Room 1
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-300 text-3xl italic">No active patients</div>
                    )}
                </div>

                <div className="bg-gray-800 rounded-3xl p-8 shadow-xl overflow-hidden">
                    <h2 className="text-gray-400 text-xl uppercase tracking-widest font-bold mb-6 border-b border-gray-700 pb-2">
                        Up Next
                    </h2>

                    <div className="space-y-4">
                        {upcomingPatients.length === 0 && (
                            <p className="text-gray-500 text-center py-10 text-xl">The queue is empty.</p>
                        )}

                        {upcomingPatients.slice(0, 5).map((apt, index) => {
                            const waitTime = calculateWaitTime(history, index + 1);

                            return (
                                <div key={apt.id} className="flex justify-between items-center p-6 bg-gray-700 rounded-xl border-l-8 border-yellow-500">
                                    <div className="flex items-center gap-6">
                                        <span className="text-4xl font-bold text-white w-16">#{apt.tokenNumber}</span>
                                        <span className="text-2xl text-gray-300 truncate w-48">{apt.patientName}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-yellow-400 font-bold text-xl flex items-center gap-2 justify-end">
                                            <span>⏱️ {waitTime} min</span>
                                        </div>
                                        <div className="text-gray-500 text-sm">Estimated Wait</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {upcomingPatients.length > 5 && (
                        <div className="mt-6 text-center text-gray-500 italic">
                            + {upcomingPatients.length - 5} more patients waiting...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}