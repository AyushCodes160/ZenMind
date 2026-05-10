import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { identifyUser, trackEvent, resetAnalytics } from './analytics.js';

// Your web app's Firebase configuration
// REPLACE THESE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Save or update user in Firestore
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    
    const isNewUser = !docSnap.exists();
    if (isNewUser) {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        streak: parseInt(localStorage.getItem('za_streak') || '0'),
        createdAt: new Date()
      });
    }

    identifyUser(user.uid, {
        $name: user.displayName,
        $email: user.email,
        user_type: "casual"
    });

    if (isNewUser) {
        trackEvent('sign_up', { sign_up_method: 'google', platform: 'web' });
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
    resetAnalytics();
  } catch (error) {
    console.error("Error signing out:", error);
  }
}

export { auth, db, onAuthStateChanged };
