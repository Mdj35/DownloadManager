// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import { getAuth, GoogleAuthProvider, signInWithPopup,FacebookAuthProvider,signInWithRedirect } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXPb6IJPETv7-maiX_iBMvlP1cVxqLf-U",
  authDomain: "sample-c5864.firebaseapp.com",
  databaseURL: "https://sample-c5864-default-rtdb.firebaseio.com",
  projectId: "sample-c5864",
  storageBucket: "sample-c5864.appspot.com",
  messagingSenderId: "977993400479",
  appId: "1:977993400479:web:41c9b5a364b727de5022aa",
  measurementId: "G-8FTE1QF1G2"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const auth = getAuth(app);
const facebookProvider = new FacebookAuthProvider();
const provider = new GoogleAuthProvider(); // Initialize Firebase Storage

// Export the app and storage
export { app, storage,auth,provider ,signInWithPopup,facebookProvider,signInWithRedirect};
