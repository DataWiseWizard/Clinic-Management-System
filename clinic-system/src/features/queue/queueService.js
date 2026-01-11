import { db } from "../../lib/firebase";
import {
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    query,
    where,
    limit,
    getDocs,
    orderBy,
    onSnapshot
} from "firebase/firestore";

const getTodayStr = () => new Date().toISOString().split("T")[0];

/**
 * Adds a patient to the queue securely using a Transaction.
 * @param {string} patientId 
 * @param {object} patientData (Snapshot of name, age, etc. for quick display)
 */
export const addToQueue = async (patientId, patientData) => {
    const todayStr = getTodayStr();
    const statsRef = doc(db, "daily_stats", todayStr);
    const appointmentsRef = collection(db, "appointments");

    try {
        await runTransaction(db, async (transaction) => {
            const statsDoc = await transaction.get(statsRef);

            let nextToken = 1;

            if (statsDoc.exists()) {
                const data = statsDoc.data();
                nextToken = data.lastTokenNumber + 1;
            }
            const newAppointmentRef = doc(appointmentsRef);

            transaction.set(newAppointmentRef, {
                patientId,
                patientName: patientData.fullName,
                contact: patientData.contact,
                tokenNumber: nextToken,
                date: todayStr,
                status: "waiting",
                timestamps: {
                    created: serverTimestamp()
                },
            });

            transaction.set(statsRef, {
                lastTokenNumber: nextToken,
                date: todayStr
            }, { merge: true });
        });

        console.log("Transaction success!");
    } catch (e) {
        console.error("Transaction failed: ", e);
        throw e;
    }
};

/**
 * Real-time listener for the Active Queue
 * @param {function} callback - Function to update React state
 */
export const subscribeToQueue = (callback) => {
    const todayStr = getTodayStr();
    const q = query(
        collection(db, "appointments"),
        where("date", "==", todayStr),
        where("status", "==", "waiting"),
        orderBy("tokenNumber", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const queue = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(queue);
    });
};

export const getQueueHistory = async () => {
  const todayStr = new Date().toISOString().split("T")[0];
  const q = query(
    collection(db, "appointments"),
    where("date", "==", todayStr),
    where("status", "==", "completed"),
    orderBy("timestamps.completed", "desc"),
    limit(10)
  );

  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.warn("Analytics fetch failed:", error);
    return [];
  }
};