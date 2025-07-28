import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

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

// initialize firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.database();
export const firestoreDB = firebase.firestore();

export default firebase;
