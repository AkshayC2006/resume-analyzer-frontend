import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIJ3dSyS81bGnRzfJr68PNY9I5PlkwMSg",
  authDomain: "resume-analyzer-c89d7.firebaseapp.com",
  projectId: "resume-analyzer-c89d7",
  storageBucket: "resume-analyzer-c89d7.appspot.com",
  messagingSenderId: "140880422807",
  appId: "1:140880422807:web:94f1bc7b15040d0aac86d2",
  measurementId: "G-FXQRMXRNS4"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
