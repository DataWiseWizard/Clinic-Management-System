import { db } from "../../lib/firebase";
import {
    collection,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp
} from "firebase/firestore";

export const getPatientHistory = async (patientId) => {
    console.log("🔍 Fetching history for Patient ID:", patientId);
    try {
        const q = query(
            collection(db, "appointments"),
            where("patientId", "==", patientId),
            orderBy("timestamps.created", "desc")
        );

        const snapshot = await getDocs(q);
        console.log("📄 Raw Documents Found:", snapshot.docs.length);
        const rawData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("📦 Raw Data:", rawData);

        const history = rawData.filter(apt => {
            const isRelevant = apt.status === "completed" || apt.status === "billing";
            console.log(`Checking Apt ${apt.id}: Status is '${apt.status}' -> Keep? ${isRelevant}`);
            return isRelevant;
        });

        history.sort((a, b) => b.timestamps.created - a.timestamps.created);
        return history;
    } catch (error) {
        console.error("Error fetching history:", error);
        throw error;
    }
};

export const startConsultation = async (appointmentId) => {
    const ref = doc(db, "appointments", appointmentId);
    try {
        await Promise.race([
            updateDoc(ref, {
                status: "in_consultation",
                "timestamps.consultationStart": serverTimestamp()
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Write Timeout")), 500))
        ]);
    } catch (err) {
        if (err.message !== "Write Timeout") throw err;
        console.log("Offline: Consultation started locally.");
    }
};

export const finishConsultation = async (appointmentId, clinicalData, billingAmount) => {
    const ref = doc(db, "appointments", appointmentId);
    try {
        await Promise.race([
            updateDoc(ref, {
                status: "billing",
                "timestamps.completed": serverTimestamp(),
                clinicalData: clinicalData,
                "billing.consultationFee": billingAmount,
                "billing.paymentStatus": "pending"
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Write Timeout")), 500))
        ]);
    } catch (err) {
        if (err.message !== "Write Timeout") throw err;
        console.log("Offline: Consultation finished locally.");
    }
};