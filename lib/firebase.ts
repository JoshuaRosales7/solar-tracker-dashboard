// lib/firebase.ts
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
apiKey: "AIzaSyCT48Io3ZAB0wAAeQYb7XEi_-9ihV4ZA18",
  authDomain: "solarmetricslg.firebaseapp.com",
  databaseURL: "https://solarmetricslg-default-rtdb.firebaseio.com",
  projectId: "solarmetricslg",
  storageBucket: "solarmetricslg.firebasestorage.app",
  messagingSenderId: "406882282505",
  appId: "1:406882282505:web:861475b3a4b2cabdd81cd8",
  measurementId: "G-JM99JBFBWJ"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
