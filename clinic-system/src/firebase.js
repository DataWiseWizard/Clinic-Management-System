// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// PASTE YOUR KEYS HERE
const firebaseConfig = {
    apiKey: "AIzaSyClS6nGbUIBVmkJkeegcG6-0icNXAEhrtk",
    authDomain: "clinic-management-system-bf524.firebaseapp.com",
    projectId: "clinic-management-system-bf524",
    storageBucket: "clinic-management-system-bf524.firebasestorage.app",
    messagingSenderId: "574650560798",
    appId: "1:574650560798:web:ae0ff2525d8a635e35990f",
    measurementId: "G-Y3WXH35D1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
// Why? We export these so we can use them in other files 
// without re-initializing the app every time.
export const auth = getAuth(app);
export const db = getFirestore(app);