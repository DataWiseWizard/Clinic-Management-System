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
    try {
        const q = query(
            collection(db, "queue"),
            where("patientId", "==", patientId),
            orderBy("timestamp", "desc")
        );

        const snapshot = await getDocs(q);
        const rawData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const history = rawData.filter(apt => {
            const isRelevant = apt.status === "completed" || apt.status === "billing";
            return isRelevant;
        });
        return history;
    } catch (error) {
        console.error("Error fetching history:", error);
        throw error;
    }
};

export const startConsultation = async (appointmentId) => {
    const ref = doc(db, "queue", appointmentId);
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
    const ref = doc(db, "queue", appointmentId);
    try {
        await Promise.race([
            updateDoc(ref, {
                status: "billing",
                "timestamps.completed": serverTimestamp(),
                clinicalData: clinicalData,
                billing: {
                    consultationFee: billingAmount,
                    paymentStatus: "pending",
                    total: billingAmount
                }
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Write Timeout")), 500))
        ]);
    } catch (err) {
        if (err.message !== "Write Timeout") throw err;
        console.log("Offline: Consultation finished locally.");
    }
};