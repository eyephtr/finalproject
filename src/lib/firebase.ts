import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDsCMHY8h-ABDlHSU5LcD7KMFt7k16MD1g",
    authDomain: "final-project-18552.firebaseapp.com",
    projectId: "final-project-18552",
    storageBucket: "final-project-18552.firebasestorage.app",
    messagingSenderId: "993960292227",
    appId: "1:993960292227:web:2d8a324cef176d938390b6",
    measurementId: "G-WNYC74GG21"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

