// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// firebase real time database
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC78i4tLpEAyu3DUC05wAdAlsbJe07YTo",
  authDomain: "realtime-dbx.firebaseapp.com",
  projectId: "realtime-dbx",
  storageBucket: "realtime-dbx.firebasestorage.app",
  messagingSenderId: "833371855249",
  appId: "1:833371855249:web:cd29f336975d83fb2d6230",
  measurementId: "G-NRXFG6LVZD",
  databaseURL: "https://realtime-dbx-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
