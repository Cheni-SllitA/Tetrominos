// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";       
import { getFirestore } from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyB6sL5V5OjIWjjmPhC3Vk7Kjj7RjwPhmu8",
  authDomain: "tetrominos-f893d.firebaseapp.com",
  projectId: "tetrominos-f893d",
  storageBucket: "tetrominos-f893d.firebasestorage.app",
  messagingSenderId: "835256782282",
  appId: "1:835256782282:web:c602bba8eb9d0e6a309333",
  measurementId: "G-KRJBHY1XJ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const analytics = getAnalytics(app);