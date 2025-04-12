// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAHdvsUER3PjvR0IenrxZO94k8cTaPXB0",
  authDomain: "interntrack-d846f.firebaseapp.com",
  projectId: "interntrack-d846f",
  storageBucket: "interntrack-d846f.firebasestorage.app",
  messagingSenderId: "14928536708",
  appId: "1:14928536708:web:40e1b6cd1702e44a050ed1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Create auth instance and provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Add basic scopes for user data
provider.addScope('email');
provider.addScope('profile');

// Export both auth and provider
export { auth, provider };