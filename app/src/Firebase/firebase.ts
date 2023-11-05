// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';
import { getDatabase} from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDxVhMByhnDj2NNCHobXzCB9eXxe3LP2CI",
  authDomain: "diary-app-f3b28.firebaseapp.com",
  projectId: "diary-app-f3b28",
  storageBucket: "diary-app-f3b28.appspot.com",
  messagingSenderId: "810790360485",
  appId: "1:810790360485:web:4ec394dc5b4138b915444c",
  databaseURL: 'https://diary-app-f3b28-default-rtdb.asia-southeast1.firebasedatabase.app/'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const store = getStorage(app);
export const database = getDatabase(app);


