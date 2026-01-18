import { db } from "../../lib/firebase";
import {
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp,
  limit
} from "firebase/firestore";

export const subscribeToBilling = (callback) => {
  const q = query(
    collection(db, "queue"),
    where("status", "==", "billing"),
    where("billing.paymentStatus", "==", "pending"),
    orderBy("timestamps.completed", "asc")
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
};

export const subscribeToRecentPayments = (callback) => {
  const q = query(
    collection(db, "queue"),
    where("status", "==", "completed"),
    where("billing.paymentStatus", "==", "paid"),
    orderBy("timestamps.paymentTime", "desc"),
    limit(10)
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
};

export const processPayment = async (appointmentId) => {
  const ref = doc(db, "queue", appointmentId);

  await updateDoc(ref, {
    status: "completed",
    "billing.paymentStatus": "paid",
    "timestamps.paymentTime": serverTimestamp()
  });
};