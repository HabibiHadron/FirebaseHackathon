// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlLl4CSGoU1YIjOkhu5NVgNZeRr3Ev3Pw",
  authDomain: "hackathon-d1e9b.firebaseapp.com",
  projectId: "hackathon-d1e9b",
  storageBucket: "hackathon-d1e9b.appspot.com",
  messagingSenderId: "43586921342",
  appId: "1:43586921342:web:38641729f9efe2979cc92f",
  measurementId: "G-VLT5CEPJPY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
export { auth, firestore };
