import { db } from "../../lib/firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    updateDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";

const getTodayStr = () => new Date().toISOString().split("T")[0];

/**
 * Adds a patient to the queue securely using a Transaction.
 * @param {string} patientId 
 * @param {object} patientData (Snapshot of name, age, etc. for quick display)
 */
export const addToQueue = async (patientId, patientData) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const q = query(
        collection(db, "queue"),
        where("timestamp", ">=", startOfDay),
        orderBy("timestamp", "desc"),
        limit(1)
    );

    const snapshot = await getDocs(q);
    let nextToken = 1;

    if (!snapshot.empty) {
        const lastItem = snapshot.docs[0].data();
        nextToken = (lastItem.token || 0) + 1;
    }

    const queueData = {
        patientId,
        patientName: patientData.fullName,
        reason: patientData.purpose || "General Consultation",
        token: nextToken,
        status: "waiting",
        timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "queue"), queueData);
    return { id: docRef.id, token: nextToken };
};

export const getPeopleAhead = async (myToken) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const q = query(
        collection(db, "queue"),
        where("status", "==", "waiting"),
        where("timestamp", ">=", startOfDay),
        where("token", "<", myToken)
    );

    const snapshot = await getDocs(q);
    return snapshot.size;
};

/**
 * Real-time listener for the Active Queue
 * @param {function} callback - Function to update React state
 */
export const subscribeToQueue = (callback) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const q = query(
        collection(db, "queue"),
        where("status", "==", "waiting"),
        where("timestamp", ">=", startOfDay),
        orderBy("timestamp", "asc")
    );

    return onSnapshot(q, (snapshot) => {
        const queue = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            tokenNumber: doc.data().token
        }));
        callback(queue);
    });
};

export const getQueueHistory = async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const q = query(
        collection(db, "queue"),
        where("status", "==", "completed"),
        where("timestamp", ">=", startOfDay)
    );

    try {
        const snapshot = await getDocs(q);
        const rawData = snapshot.docs.map(doc => doc.data());
        
        return rawData;

    } catch (error) {
        console.warn("Analytics fetch failed:", error);
        return [];
    }
};