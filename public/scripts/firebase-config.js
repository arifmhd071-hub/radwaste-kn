// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnI0xpTjetsLhA9eKHcPN8g8qcxDJVXPU",
  authDomain: "radwaste-kn.firebaseapp.com",
  projectId: "radwaste-kn",
  storageBucket: "radwaste-kn.firebasestorage.app",
  messagingSenderId: "250512919175",
  appId: "1:250512919175:web:39393f4050df6abb93c622",
  measurementId: "G-9WNSFPH1CW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export untuk digunakan di file lain
export { app, analytics, auth, db };
