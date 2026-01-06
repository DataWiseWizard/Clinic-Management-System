import { db } from "../../lib/firebase";
import { collection, doc, setDoc, query, where, getDocs, Timestamp } from "firebase/firestore";

const COLLECTION_NAME = "patients";

const generateKeywords = (name) => {
  const words = name.toLowerCase().split(" ");
  const keywords = [];
  words.forEach(word => {
    let temp = "";
    for (const char of word) {
      temp += char;
      keywords.push(temp);
    }
  });
  return keywords;
};

export const addPatient = async (patientData) => {
  try {
    const patientsRef = collection(db, COLLECTION_NAME);
    if (navigator.onLine) {
      const q = query(patientsRef, where("contact", "==", patientData.contact));
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Network Timeout")), 2000)
      );

      const snapshot = await Promise.race([
        getDocs(q),
        timeoutPromise
      ]);

      if (!snapshot.empty) {
        throw new Error("Patient with this phone number already exists!");
      }
    } else {
      console.warn("Offline: Skipping duplicate check to allow local write.");
    }
    const newPatient = {
      ...patientData,
      id: newDocRef.id,
      createdAt: Timestamp.now(),
      searchKeywords: generateKeywords(patientData.fullName),
    };

    const docRef = await addDoc(patientsRef, newPatient);
    return docRef.id;

  } catch (err) {
    if (err.message === "Write Timeout") {
      console.log("ℹ️ Write timed out (Offline). Assuming success via cache.");
    } else {
      throw err;
    }
  }
};

export const searchPatients = async (searchTerm) => {
  const patientsRef = collection(db, COLLECTION_NAME);
  let q = patientsRef;

  if (searchTerm) {
    q = query(patientsRef, where("searchKeywords", "array-contains", searchTerm.toLowerCase()));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};