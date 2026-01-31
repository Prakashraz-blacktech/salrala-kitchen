// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBUUAQSd6YOwrhu4lon1PSnaFX1qjTQOY",
  authDomain: "sarala-kitchen.firebaseapp.com",
  projectId: "sarala-kitchen",
  storageBucket: "sarala-kitchen.appspot.com",
  messagingSenderId: "778455628613",
  appId: "1:778455628613:web:a6e7039330a5a3ef059c2c",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
