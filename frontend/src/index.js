import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxedvmpXlsN9blxntOgcohbWK8ZVTAhI8",
  authDomain: "automatic-scheduling-system.firebaseapp.com",
  projectId: "automatic-scheduling-system",
  storageBucket: "automatic-scheduling-system.appspot.com",
  messagingSenderId: "643846234175",
  appId: "1:643846234175:web:52e29db60a5a93e8ab188a",
  measurementId: "G-SV29QB4NZ5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const employeesRef = collection(db, "employees");
const datesRef = collection(db, "dates");
const availabilitiesRef = collection(db, "availabilities");
const schedulesRef = collection(db, "schedules");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

export { employeesRef, datesRef, db, availabilitiesRef, schedulesRef };
