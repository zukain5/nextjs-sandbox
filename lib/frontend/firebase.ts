import firebaseConfig from "@/config/frontend/firebaseConfig";
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
