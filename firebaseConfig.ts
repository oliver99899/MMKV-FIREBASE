import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQxKRM-aGR0_wmmcVQpcagUYMCjmHR27Y",
  authDomain: "proyektugaspbp.firebaseapp.com",
  projectId: "proyektugaspbp",
  storageBucket: "proyektugaspbp.firebasestorage.app",
  messagingSenderId: "224590276848",
  appId: "1:224590276848:web:eeabe5f0bf43073c6eba35",
  measurementId: "G-64BNZKEZ0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);