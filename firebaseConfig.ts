import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as firebaseAuth from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyAClySZ4lvQHCjialUKCbvc6WxPieriado",
    authDomain: "plani-event-app.firebaseapp.com",
    projectId: "plani-event-app",
    storageBucket: "plani-event-app.appspot.com",
    messagingSenderId: "332334193413",
    appId: "1:332334193413:web:85035d27243b78912c356c"
};

// Initialize Firebase
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
export const app = initializeApp(firebaseConfig);
export const firestore_db=getFirestore(app)
export const storage=getStorage(app);
export const auth = firebaseAuth.initializeAuth(app, {
    persistence:reactNativePersistence(AsyncStorage),
});