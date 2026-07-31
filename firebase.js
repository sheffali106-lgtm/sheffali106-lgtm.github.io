// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyd-NNlsWWf4GkBdhthXBLp2LWvRWvOiE",
  authDomain: "renteasy-kenya.firebaseapp.com",
  projectId: "renteasy-kenya",
  storageBucket: "renteasy-kenya.firebasestorage.app",
  messagingSenderId: "691155079697",
  appId: "1:691155079697:web:8aa17df226b45ab776d7b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };