// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
//import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMYBazBpuEZnxZrhMhyA2LLZqSFol7G74",
  authDomain: "lifta-75e19.firebaseapp.com",
  projectId: "lifta-75e19",
  storageBucket: "lifta-75e19.appspot.com",
  messagingSenderId: "446522005224",
  appId: "1:446522005224:web:713268d1ebe423b7aa1b5d",
  measurementId: "G-8V2VT2KWBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
