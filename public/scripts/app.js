import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Contoh fungsi register
async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User terdaftar:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error register:", error.message);
    throw error;
  }
}

// Contoh fungsi login
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User login:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error login:", error.message);
    throw error;
  }
}

// Export fungsi
export { registerUser, loginUser };