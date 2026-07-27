import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9zIxmhXIiLf-H4Kb-JzrygJYQkUp-84g",
  authDomain: "vwgsm353.firebaseapp.com",
  projectId: "vwgsm353",
  storageBucket: "vwgsm353.firebasestorage.app",
  messagingSenderId: "574778184422",
  appId: "1:574778184422:web:a4e30ab36b91d65cc26127",
  measurementId: "G-3DP7XDHB12"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

export default app;