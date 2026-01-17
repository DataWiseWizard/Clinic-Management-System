import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, onSnapshot, doc, serverTimestamp } from "firebase/firestore";
import { getPeopleAhead } from "../features/queue/queueService";
import { FaHospitalUser, FaCheckCircle, FaSpinner, FaWalking, FaClock } from "react-icons/fa";

export default function CheckIn() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [purpose, setPurpose] = useState("");

  const [requestId, setRequestId] = useState(null);
  const [status, setStatus] = useState("idle");

  const [queueData, setQueueData] = useState(null);
  const [peopleAhead, setPeopleAhead] = useState(0);

  useEffect(() => {
    if (!requestId) return;

    const unsub = onSnapshot(doc(db, "incoming_requests", requestId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === "approved" && data.queueId) {
          setStatus("approved");
          watchQueueItem(data.queueId);
        }
      }
    });
    return () => unsub();
  }, [requestId]);

  const watchQueueItem = (queueId) => {
    onSnapshot(doc(db, "queue", queueId), async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setQueueData(data);

        if (data.status === 'waiting') {
          const ahead = await getPeopleAhead(data.token);
          setPeopleAhead(ahead);
        }
        if (data.status === 'in_progress') {
          triggerAlert();
        }
      }
    });
  };

  const triggerAlert = () => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.play().catch(e => console.log("Audio play failed (user interaction needed first)"));

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("It's your turn!", { body: "Please proceed to the doctor's room." });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const docRef = await addDoc(collection(db, "incoming_requests"), {
        fullName: name,
        contact: contact,
        purpose: purpose,
        status: "pending",
        timestamp: serverTimestamp()
      });
      setRequestId(docRef.id);
      setStatus("waiting");
    } catch (err) {
      alert("Error: " + err.message);
      setStatus("idle");
    }
  };

  if (status === "approved" && queueData) {
    const isCalled = queueData.status === 'in_progress';
    const isCompleted = queueData.status === 'completed';

    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${isCalled ? 'bg-green-600 animate-pulse' : 'bg-green-50'}`}>
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full border-t-8 border-green-500 relative">

          {isCalled && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-bounce">
              GO TO ROOM 1
            </div>
          )}

          <div className="mb-6">
            {isCalled ? (
              <FaWalking className="mx-auto text-8xl text-green-600" />
            ) : (
              <FaCheckCircle className="mx-auto text-6xl text-green-500" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isCalled ? "It's Your Turn!" : "You're Checked In"}
          </h1>

          <div className="bg-green-100 text-green-800 text-6xl font-mono font-bold py-8 rounded-xl my-6 border-2 border-green-200">
            #{queueData.token}
          </div>

          {!isCalled && !isCompleted && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">People Ahead</p>
                <p className="text-2xl font-bold text-blue-600">{peopleAhead}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Est. Wait</p>
                <p className="text-2xl font-bold text-blue-600 flex justify-center items-center gap-1">
                  <FaClock size={16} /> {peopleAhead * 10}m
                </p>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-400 mt-6">
            {isCalled ? "Please proceed to the consultation room." : "Please take a seat. We will notify you when ready."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <FaHospitalUser className="text-white text-5xl mx-auto mb-2 opacity-90" />
          <h1 className="text-2xl font-bold text-white">Patient Self Check-In</h1>
          <p className="text-blue-100 text-sm">Enter your details to join the queue</p>
        </div>

        <div className="p-8">
          {status === "waiting" ? (
            <div className="text-center py-10">
              <FaSpinner className="animate-spin text-blue-600 text-5xl mx-auto mb-6" />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Request Sent</h2>
              <p className="text-gray-500">Waiting for reception to approve...</p>
              <p className="text-xs text-gray-400 mt-4">Do not close this window.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                <input
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="e.g. 555-0123"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Purpose of Visit</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                >
                  <option value="">Select Purpose...</option>
                  <option value="Consultation">General Consultation</option>
                  <option value="Follow-up">Follow-up Visit</option>
                  <option value="Emergency">Urgent / Emergency</option>
                  <option value="Report">Report Collection</option>
                </select>
              </div>

              <button
                disabled={status === "submitting"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Sending..." : "Join Queue"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}