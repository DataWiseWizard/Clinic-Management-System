// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "../lib/firebase";

// const CheckIn = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     symptoms: ""
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       console.log("Attempting to write to DB:", db);

//       await addDoc(collection(db, "appointments"), {
//         patientName: formData.name,
//         patientPhone: formData.phone,
//         symptoms: formData.symptoms || "Self Check-in",
//         status: "request",
//         type: "online_checkin",
//         createdAt: serverTimestamp(),
//       });

//       alert("Request sent! Please wait for the receptionist to call you.");
//       setFormData({ name: "", phone: "", symptoms: "" });
//     } catch (error) {
//       console.error("Error checking in:", error);
//       alert("Error: " + error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Patient Check-In</h1>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Full Name</label>
//             <input
//               required
//               type="text"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone Number</label>
//             <input
//               required
//               type="tel"
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Symptoms (Optional)</label>
//             <textarea
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
//               value={formData.symptoms}
//               onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
//           >
//             Submit Check-In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CheckIn;
