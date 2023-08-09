// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBRtVW5wOxT2lf1JlNlk7MSv1R5EBP_lhU",
  authDomain: "monrestaurant-f4143.firebaseapp.com",
  databaseURL: "https://monrestaurant-f4143-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "monrestaurant-f4143",
  storageBucket: "monrestaurant-f4143.appspot.com",
  messagingSenderId: "486086267217",
  appId: "1:486086267217:web:99b6c51b5b606850c64370",
  measurementId: "G-0CJ5RXHGK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const analytics = getAnalytics(app)

const database = getDatabase(app)

export default database

export const auth = getAuth(app)

export const storage = getStorage(app)