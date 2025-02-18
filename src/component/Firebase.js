import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAlgLfwOAbMxOZFInQRcF9Ex8_B0nD0phY",
    authDomain: "shoes-website-9cce9.firebaseapp.com",
    projectId: "shoes-website-9cce9",
    storageBucket: "shoes-website-9cce9.firebasestorage.app",
    messagingSenderId: "514507103283",
    appId: "1:514507103283:web:d54ccc46891d7d80775746",
    measurementId: "G-0S3YM1GM12"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };