// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "tfstore-979eb.firebaseapp.com",
  projectId: "tfstore-979eb",
  storageBucket: "tfstore-979eb.appspot.com",
  messagingSenderId: "729738116055",
  appId: "1:729738116055:web:329f07452bb15689c82992",
  measurementId: "G-QM9NPVRWZR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
