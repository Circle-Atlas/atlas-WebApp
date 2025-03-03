// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAObRm90Wps9GkcskYq1GgZJBDv3jJAq2s",
  authDomain: "atlas-14386.firebaseapp.com",
  projectId: "atlas-14386",
  storageBucket: "atlas-14386.appspot.com",
  messagingSenderId: "77319468044",
  appId: "1:77319468044:web:e31abcf323b0d85d566a29",
  measurementId: "G-TN95H2W4JK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);