import { useState, useEffect } from "react";
import { saveSecurely, loadSecurely } from "../../utils/secureStorage";
import { submitCheckIn } from "./checkInService";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function CheckInPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        symptoms: ""
    });
    const [rememberMe, setRememberMe] = useState(true);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("form");

    useEffect(() => {
        const savedProfile = loadSecurely("patient_profile");
        if (savedProfile) {
            setFormData(prev => ({
                ...prev,
                fullName: savedProfile.fullName || "",
                contact: savedProfile.contact || "",
                age: savedProfile.age || ""
            }));
        }
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log("Attempting to write to DB:", db); // Debug log

            await addDoc(collection(db, "appointments"), {
                patientName: formData.name,
                patientPhone: formData.phone,
                symptoms: formData.symptoms || "Self Check-in",
                status: "request", // This triggers the Incoming Request panel
                type: "online_checkin",
                createdAt: serverTimestamp(),
            });

            alert("Request sent! Please wait for the receptionist to call you.");
            setFormData({ name: "", phone: "", symptoms: "" }); // Reset form
        } catch (error) {
            console.error("Error checking in:", error);
            alert("Error: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Patient Check-In</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            required
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            required
                            type="tel"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Symptoms (Optional)</label>
                        <textarea
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                            value={formData.symptoms}
                            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Submit Check-In
                    </button>
                </form>
            </div>
        </div>
    );
};

// export default function CheckInPage() {
//     const [formData, setFormData] = useState({
//         fullName: "",
//         contact: "",
//         age: "",
//         symptoms: ""
//     });
//     const [rememberMe, setRememberMe] = useState(true);
//     const [loading, setLoading] = useState(false);
//     const [step, setStep] = useState("form");

//     useEffect(() => {
//         const savedProfile = loadSecurely("patient_profile");
//         if (savedProfile) {
//             setFormData(prev => ({
//                 ...prev,
//                 fullName: savedProfile.fullName || "",
//                 contact: savedProfile.contact || "",
//                 age: savedProfile.age || ""
//             }));
//             // alert("Welcome back! Your details have been auto-filled securely.");
//         }
//     }, []);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             await addDoc(collection(db, "appointments"), {
//                 patientName: formData.name,
//                 patientPhone: formData.phone,
//                 symptoms: formData.symptoms || "Self Check-in",
//                 status: "request",
//                 type: "online_checkin",
//                 createdAt: serverTimestamp(),
//             });

//             setFormData({ name: "", phone: "", symptoms: "" }); // Reset form
//             await submitCheckIn(formData);
//             setStep("success");
//             alert("Request sent! Please wait for the receptionist to call you.");
//         } catch (err) {
//             alert("Error checking in: " + err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (step === "success") {
//         return (
//             <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
//                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-4">
//                     ✓
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800">Checked In!</h2>
//                 <p className="text-gray-600 mt-2">
//                     Your details have been sent to the reception desk.
//                     <br />Please wait for your name to be called.
//                 </p>
//                 <button
//                     onClick={() => window.location.reload()}
//                     className="mt-8 text-green-700 underline"
//                 >
//                     Start New Check-in
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-10 px-4">
//             <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-lg">
//                 <div className="bg-blue-600 p-6 text-center">
//                     <h1 className="text-white text-xl font-bold">Clinic Self Check-In</h1>
//                     <p className="text-blue-100 text-sm mt-1">Scan. Click. Done.</p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="p-8 space-y-6">

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Full Name</label>
//                         <input
//                             required
//                             type="text"
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
//                             placeholder="e.g. John Doe"
//                             value={formData.fullName}
//                             onChange={e => setFormData({ ...formData, fullName: e.target.value })}
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Phone</label>
//                             <input
//                                 required
//                                 type="tel"
//                                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
//                                 placeholder="10 digits"
//                                 value={formData.contact}
//                                 onChange={e => setFormData({ ...formData, contact: e.target.value })}
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">Age</label>
//                             <input
//                                 required
//                                 type="number"
//                                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
//                                 placeholder="Age"
//                                 value={formData.age}
//                                 onChange={e => setFormData({ ...formData, age: e.target.value })}
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">Symptoms (Optional)</label>
//                         <textarea
//                             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
//                             rows="2"
//                             placeholder="Fever, cough, headache..."
//                             value={formData.symptoms}
//                             onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
//                         />
//                     </div>

//                     <div className="flex items-start">
//                         <div className="flex items-center h-5">
//                             <input
//                                 id="remember"
//                                 type="checkbox"
//                                 checked={rememberMe}
//                                 onChange={e => setRememberMe(e.target.checked)}
//                                 className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
//                             />
//                         </div>
//                         <div className="ml-3 text-sm">
//                             <label htmlFor="remember" className="font-medium text-gray-700">Remember me on this device</label>
//                             <p className="text-gray-500 text-xs">Your details are securely encrypted on your phone.</p>
//                         </div>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                     >
//                         {loading ? "Sending..." : "Send to Reception"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }