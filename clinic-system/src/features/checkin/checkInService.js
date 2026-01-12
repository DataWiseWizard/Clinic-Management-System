import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const submitCheckIn = async (patientData) => {
  try {
    await addDoc(collection(db, "pending_registrations"), {
      ...patientData,
      status: "pending",
      submittedAt: serverTimestamp(),
      source: "self-check-in-qr" 
    });
    return true;
  } catch (error) {
    console.error("Check-in Error:", error);
    throw error;
  }
};