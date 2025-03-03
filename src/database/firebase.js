// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAObRm90Wps9GkcskYq1GgZJBDv3jJAq2s",
  authDomain: "atlas-14386.firebaseapp.com",
  projectId: "atlas-14386",
  storageBucket: "atlas-14386.appspot.com",
  messagingSenderId: "77319468044",
  appId: "1:77319468044:web:e31abcf323b0d85d566a29",
  measurementId: "G-TN95H2W4JK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app }