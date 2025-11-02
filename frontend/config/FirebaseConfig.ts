// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAI, getGenerativeModel, getLiveGenerativeModel, GoogleAIBackend, ResponseModality } from "firebase/ai";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN!,
  projectId: import.meta.env.VITE_PROJECT_ID!,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET!,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID!,
  appId: import.meta.env.VITE_APP_ID!,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID!,
  
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export  const firbaseDb=getFirestore(app)
// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
export const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });
export const LiveGenerativeModel = getLiveGenerativeModel(ai, {
  model: "gemini-2.0-flash-live-001",
  // Configure the model to respond with text
  generationConfig: {
    responseModalities: [ResponseModality.TEXT],
  },
});

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyB93bNIbTnAFdzwxEm3-yG5GhYVpD1K2H4",
//   authDomain: "ai-ppt-464de.firebaseapp.com",
//   projectId: "ai-ppt-464de",
//   storageBucket: "ai-ppt-464de.firebasestorage.app",
//   messagingSenderId: "163713285289",
//   appId: "1:163713285289:web:839926a7c4acc0ada4bdb8",
//   measurementId: "G-ZMN2D0NX46"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);