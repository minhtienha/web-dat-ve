import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcD2eYWrbWJSAsmOt7LnvsecIAp3Uqo8U",
  authDomain: "web-datvexemphim.firebaseapp.com",
  projectId: "web-datvexemphim",
  storageBucket: "web-datvexemphim.appspot.com",

  messagingSenderId: "116728880015",
  appId: "1:116728880015:web:529912e9458c8a8a0249fa",
  measurementId: "G-EQP1KSCH3V",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
