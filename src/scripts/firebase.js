// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYaty9_7g5xZME-ICPXeKCSOw-RIwQyCY",
  authDomain: "jctraining-8c0f4.firebaseapp.com",
  projectId: "jctraining-8c0f4",
  storageBucket: "jctraining-8c0f4.appspot.com",
  messagingSenderId: "41363614884",
  appId: "1:41363614884:web:4141c544e1e760a2b68a31",
  measurementId: "G-829DKJFD41",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
