
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDP2IaqZpSnCx9slwqT8AHYbwaktoYiVkM",
  authDomain: "customerdata-1fe09.firebaseapp.com",
  projectId: "customerdata-1fe09",
  storageBucket: "customerdata-1fe09.firebasestorage.app",
  messagingSenderId: "577656557205",
  appId: "1:577656557205:web:66b5d31f8298f8f592959c",
  measurementId: "G-E7LK92TL85"
};


export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

