// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase gerada pelo console
const firebaseConfig = {
  apiKey: "AIzaSyBSoKystgtjz1MJgRvrfMjM6XEnRYL7_8o",
  authDomain: "desapegueime-f61a0.firebaseapp.com",
  projectId: "desapegueime-f61a0",
  storageBucket: "desapegueime-f61a0.firebasestorage.app",
  messagingSenderId: "667158362651",
  appId: "1:667158362651:web:71aa6b1f373fcebb2696be",
  measurementId: "G-VKN74KEZDQ",
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore para uso no projeto
export const db = getFirestore(app);
