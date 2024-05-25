// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-ghRA4uKK_rzUhP6AXxK230WXnP56TAw",
  authDomain: "adv-final-ad15b.firebaseapp.com",
  projectId: "adv-final-ad15b",
  storageBucket: "adv-final-ad15b.appspot.com",
  messagingSenderId: "323707843477",
  appId: "1:323707843477:web:113a89513d46a0a2977c9c"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app, "gs://adv-final-ad15b.appspot.com");

export { 
  db, 
  auth,
  storage
}
