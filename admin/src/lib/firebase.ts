
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChtnbeqROM3ApgQGfmmBAS259rqloSQOc",
  authDomain: "brand-f7182.firebaseapp.com",
  projectId: "brand-f7182",
  storageBucket: "brand-f7182.firebasestorage.app",
  messagingSenderId: "965093408272",
  appId: "1:965093408272:web:3a60ebfd5e33f7aeb7d495",
  measurementId: "G-PD6CWX49KS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
