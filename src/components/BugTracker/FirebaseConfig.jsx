// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_auth_Domain,
  projectId: import.meta.env.VITE_project_Id,
  storageBucket: import.meta.env.VITE_storage_Bucket,
  messagingSenderId: import.meta.env.VITE_messaging_SenderId,
  appId: import.meta.env.VITE_app_Id,
  measurementId: import.meta.env.VITE_measurement_Id,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export default db;
