import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    await addDoc(collection(db, "appointments"), {
      patientName: formData.name,
      patientPhone: formData.phone,
      symptoms: formData.symptoms || "Self Check-in",
      status: "request",
      type: "online_checkin",
      createdAt: serverTimestamp(),
    });
    
    alert("Request sent! Please wait for the receptionist to call you.");
  } catch (error) {
    console.error("Error checking in:", error);
  }
};