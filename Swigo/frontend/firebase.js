// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "Zyngo-17827.firebaseapp.com",
  projectId: "Zyngo-17827",
  storageBucket: "Zyngo-17827.firebasestorage.app",
  messagingSenderId: "619345443414",
  appId: "1:619345443414:web:61ba408395dfd13f3559f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth , app};