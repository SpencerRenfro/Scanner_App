// import firebase from "firebase/app";
// import "firebase/firestore";

// // // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCjfVv46YkJ9wdpjiByBIWCykMGI2KIZBA",
//   authDomain: "scannerapp-734a6.firebaseapp.com",
//   databaseURL: "https://scannerapp-734a6-default-rtdb.firebaseio.com",
//   projectId: "scannerapp-734a6",
//   storageBucket: "scannerapp-734a6.firebasestorage.app",
//   messagingSenderId: "249681170400",
//   appId: "1:249681170400:web:a56bc3f7a09d6d127ee585",
//   measurementId: "G-CCMRTJZWS5",
// };

// // // init firebase
// firebase.initializeApp(firebaseConfig);

// // //init firestore service

// const projectFirestore = firebase.firestore();
// console.log("Firestore initialized:", projectFirestore);

// export { projectFirestore };
import { initializeApp } from "firebase/app";
import { getFirestore, } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCjfVv46YkJ9wdpjiByBIWCykMGI2KIZBA",
  authDomain: "scannerapp-734a6.firebaseapp.com",
  databaseURL: "https://scannerapp-734a6-default-rtdb.firebaseio.com",
  projectId: "scannerapp-734a6",
  storageBucket: "scannerapp-734a6.firebasestorage.app",
  messagingSenderId: "249681170400",
  appId: "1:249681170400:web:a56bc3f7a09d6d127ee585",
  measurementId: "G-CCMRTJZWS5",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
