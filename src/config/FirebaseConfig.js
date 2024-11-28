import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBM70OzRYQ1JimqHXH1To2yRQczX4H-S6E",
  authDomain: "multi-shop-75c1e.firebaseapp.com",
  projectId: "multi-shop-75c1e",
  storageBucket: "multi-shop-75c1e.appspot.com",
  messagingSenderId: "713701368158",
  appId: "1:713701368158:web:d4c53f535f2475dbeeafcf",
  measurementId: "G-CYZ0PCL7TD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider, createUserWithEmailAndPassword, sendEmailVerification };
